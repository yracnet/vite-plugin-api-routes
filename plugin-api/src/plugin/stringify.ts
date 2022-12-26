import { PluginConfig } from "./config";
import { MethodRouter, getMethodRouters, getFileRouters } from "./router";

const writeRouter = (c: MethodRouter) => {
  return `  ${c.cb} && {
    source: "${c.source}",
    method: "${c.method}",
    route : "${c.route}",
    path  : "${c.path}",
    cb    : ${c.cb},
  }`;
};

export const generateCodeRouter = (config: PluginConfig) => {
  const fileRouters = getFileRouters(config);
  const methodRouters = getMethodRouters(config);

  const importFiles = fileRouters
    .map((it) => `import * as ${it.name} from "${it.file}";`)
    .join("\n");

  const internalRouter = methodRouters.map((c) => writeRouter(c)).join(",\n");

  return `
${importFiles}

export const routeBase = "/${config.routeBase}";

const internal  = [
${internalRouter}
].filter(it => it);

export const routers = internal.map((it) => { 
  const { method, path, route, source} = it;
  return { method, path, route, source };
});

export const endpoints = internal.map((it) => it.method?.toUpperCase() + '\\t' + it.path);

const HOC_DEFAULT = (cb) => {
  return cb;
}

export const applyRouters = (applyRouter, hoc = HOC_DEFAULT) => {
  internal.forEach((it) => {
    it.cb = hoc(it.cb, it);
    applyRouter(it);
  });  
};

`;
};

export const generateCodeConfig = (config: PluginConfig) => {
  const routers = getFileRouters(config).map(({ path, file }) => ({
    path,
    file,
  }));
  const configFull = {
    ...config,
    routers,
  };
  return `
export const config = ${JSON.stringify(configFull, null, 2)};

export default config;

`;
};
