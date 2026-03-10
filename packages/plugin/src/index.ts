import { PluginOption } from "vite";
import { ApiOpts, assertConfig } from "./model";
import { apiRoutesBuild } from "./plugin-build";
import { apiRoutesRoute } from "./plugin-route";
import { apiRoutesServe } from "./plugin-serve";
import { cleanDirectory, copyFilesDirectory, findDirPlugin } from "./utils";

export const pluginAPIRoutes = (opts: ApiOpts = {}): PluginOption => {
  const apiConfig = assertConfig(opts);
  const apiDir = findDirPlugin(".api");
  cleanDirectory(apiConfig.cacheDir);
  copyFilesDirectory(apiDir, apiConfig.cacheDir, {
    files: ["configure.js", "configure-impl.js", "handler.js", "server.js"],
    alias: [
      {
        oldId: "vite-plugin-api-routes",
        newId: apiConfig.moduleId,
      }
    ]

  });
  copyFilesDirectory(apiDir, apiConfig.cacheDir, {
    files: ["env.d.ts"],
    alias: [
      {
        oldId: "@api",
        newId: apiConfig.moduleId,
      }
    ]
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
