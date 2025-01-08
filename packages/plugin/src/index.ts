import { UserConfig } from "./model";
import { apiRoutesBuild } from "./plugin-build";
import { apiRoutesRoute } from "./plugin-route";
import { apiRoutesServe } from "./plugin-serve";
import { assertConfig, copyFilesDirectory, findDirPlugin } from "./utils";

export const pluginAPIRoutes = (opts: UserConfig = {}) => {
  const apiConfig = assertConfig(opts);
  const apiDir = findDirPlugin(".api");
  copyFilesDirectory(apiDir, apiConfig.cacheDir, {
    files: [
      //Only JS
      "configure.js",
      "handler.js",
      "server.js",
      "env.d.ts",
    ],
    oldId: "@api",
    newId: apiConfig.moduleId,
  });
  return [
    //
    apiRoutesRoute(apiConfig),
    apiRoutesServe(apiConfig),
    apiRoutesBuild(apiConfig),
  ];
};

export const pluginAPI = pluginAPIRoutes;

export const createAPI = pluginAPIRoutes;

export default pluginAPIRoutes;
