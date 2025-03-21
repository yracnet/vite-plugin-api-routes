import fs from "fs";
import path from "slash-path";
import { ResolvedConfig } from "vite";
import { ApiConfig } from "../model";
import { getAllFileRouters, MethodRouter, parseMethodRouters } from "./common";

export const writeRoutersFile = (
  apiConfig: ApiConfig,
  vite: ResolvedConfig
) => {
  const { moduleId, cacheDir, routersFile } = apiConfig;
  if (routersFile.startsWith(cacheDir)) {
    const fileRouters = getAllFileRouters(apiConfig);
    const methodRouters = parseMethodRouters(fileRouters, apiConfig);
    const max = methodRouters
      .map((it) => {
        it.url = path.join("/", vite.base, apiConfig.routeBase, it.route);
        return it;
      })
      .reduce(
        (max: any, it) => {
          const cb = it.cb.length;
          const url = it.url.length;
          const route = it.route.length;
          const method = it.method.length;
          const source = it.source.length;
          max.cb = cb > max.cb ? cb : max.cb;
          max.url = url > max.url ? url : max.url;
          max.route = route > max.route ? route : max.route;
          max.method = method > max.method ? method : max.method;
          max.source = source > max.source ? source : max.source;
          return max;
        },
        { cb: 0, method: 0, route: 0, url: 0, source: 0 }
      );
    const debug = methodRouters
      .map(
        (it) =>
          "// " +
          it.method.toUpperCase().padEnd(max.method + 1, " ") +
          it.url.padEnd(max.url + 4, " ") +
          it.source
      )
      .join("\n")
      .trim();

    const writeRouter = (c: MethodRouter) => {
      return [
        "  ",
        `${c.cb}`.padEnd(max.cb + 1, " "),
        ` && { cb: `,
        `${c.cb}`.padEnd(max.cb + 1, " "),
        ", method: ",
        `"${c.method}"`.padEnd(max.method + 3, " "),
        `, route: `,
        `"${c.route}"`.padEnd(max.route + 3, " "),
        ", url: ",
        `"${c.url}"`.padEnd(max.url + 3, " "),
        ", source: ",
        `"${c.source}"`.padEnd(max.source + 3, " "),
        "}",
      ].join("");
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
