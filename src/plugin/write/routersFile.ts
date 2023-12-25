import fs from "fs";
import { join } from "slash-path";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { MethodRouter, getFileRouters, getMethodRouters } from "./common";

export const writeRoutersFile = (
  config: PluginConfig,
  vite: ResolvedConfig
) => {
  const { moduleId, cacheDir, routersFile } = config;
  if (routersFile.startsWith(cacheDir)) {
    const fileRouters = getFileRouters(config);
    const methodRouters = getMethodRouters(config);
    const writeRouter = (c: MethodRouter) => {
      return `  ${c.cb} && {
        source     : "${c.source}",
        method     : "${c.method}",
        route      : "${c.route}",
        path       : "${c.path}",
        url        : "${join(vite.base, c.path)}",
        cb         : ${c.cb},
      }`;
    };

    const importFiles = fileRouters
      .map((it) => `import * as ${it.name} from "/${it.file}";`)
      .join("\n");
    const internalRouter = methodRouters.map((c) => writeRouter(c)).join(",\n");
    const code = `
// Imports
${importFiles}
import * as configure from "${moduleId}/configure";

export const routeBase = "${config.routeBase}";

const internal  = [
${internalRouter}
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, path, route, url, source } = it;
  return { method, url, path, route, source };
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
