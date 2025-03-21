import fs from "fs";
import { join } from "slash-path";
import { ApiConfig } from "src/model";
import { ResolvedConfig } from "vite";
import { getAllFileRouters, MethodRouter, parseMethodRouters } from "./common";

export const writeRoutersFile = (
  apiConfig: ApiConfig,
  vite: ResolvedConfig
) => {
  const { moduleId, cacheDir, routersFile } = apiConfig;
  if (routersFile.startsWith(cacheDir)) {
    const fileRouters = getAllFileRouters(apiConfig);
    const methodRouters = parseMethodRouters(fileRouters, apiConfig);
    const max = methodRouters.reduce(
      (max: any, it) => {
        const x1 = it.method.length;
        const x2 = it.route.length;
        max.s1 = x1 > max.s1 ? x1 : max.s1;
        max.s2 = x2 > max.s2 ? x2 : max.s2;
        return max;
      },
      { s1: 0, s2: 0 }
    );
    const debug = methodRouters
      .map(
        (it) =>
          "// " +
          it.method.toUpperCase().padEnd(max.s1 + 2, " ") +
          it.route.padEnd(max.s2 + 4, " ") +
          it.source
      )
      .join("\n")
      .trim();

    const writeRouter = (c: MethodRouter) => {
      return `  ${c.cb} && {
        source     : "${c.source}",
        method     : "${c.method}",
        route      : "${c.route}",
        url        : "${join(vite.base, c.route)}",
        cb         : ${c.cb},
      }`;
    };

    const importFiles = fileRouters
      .map(
        (it) => `import * as ${it.varName} from "${moduleId}/root/${it.file}";`
      )
      .join("\n");
    const internalRouter = methodRouters.map((c) => writeRouter(c)).join(",\n");
    const code = `
// Files Imports
import * as configure from "${moduleId}/configure";
${importFiles}

// Public RESTful API Methods and Paths
// This section describes the available HTTP methods and their corresponding endpoints (paths).
${debug}

const internal  = [
${internalRouter}
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, route, url, source } = it;
  return { method, url, route, source };
});

export const endpoints = internal.map(
  (it) => it.method?.toUpperCase() + "\\t" + it.url
);

export const applyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};

`;
    fs.writeFileSync(routersFile, code);
  }
};
