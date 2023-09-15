import fs from "fs";
import { join } from "slash-path";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { MethodRouter, getFileRouters, getMethodRouters } from "./common";

export const writeRoutersFile = (
  config: PluginConfig,
  vite: ResolvedConfig
) => {
  const { cacheDir, routersFile } = config;
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
        middlewares: ${c.middlewares}
      }`;
    };

    const importFiles = fileRouters
      .map((it) => `import * as ${it.name} from "/${it.file}";`)
      .join("\n");
    const internalRouter = methodRouters.map((c) => writeRouter(c)).join(",\n");
    const code = `
// Imports
${importFiles}


export const routeBase = "${config.routeBase}";

const internal  = [
${internalRouter}
].filter(it => it);

export const routers = internal.map((it) => { 
  const { method, path, route, url, source} = it;
  return { method, url, path, route, source };
});

export const endpoints = internal.map((it) => it.method?.toUpperCase() + '\\t' + it.url);

const FN = (value) => value;

export const applyRouters = (applyRouter, opts = {} ) => {
  const {pre = FN, post = FN, hoc = FN} = opts;
  pre(internal)
    .forEach((it) => {
    it.cb = hoc(it.cb, it);
    applyRouter(it);
  });  
  post(internal);
};
`;
    fs.writeFileSync(routersFile, code);
  }
};
