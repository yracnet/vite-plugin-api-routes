import { UserConfig } from "./model";
import { apiRoutesBuild } from "./plugin-build";
import { apiRoutesRoute } from "./plugin-route";
import { apiRoutesServe } from "./plugin-serve";
import { assertConfig, copyAPIDirectory, getPluginDirectory } from "./utils";

export const pluginAPIRoutes = (opts: UserConfig = {}) => {
  const apiConfig = assertConfig(opts);
  const dirname = getPluginDirectory();
  copyAPIDirectory(
    dirname,
    apiConfig.cacheDir,
    [
      // Files Copies
      "configure.js",
      "handler.js",
      "server.js",
      "types.d.ts",
    ],
    "@api",
    apiConfig.moduleId
  );
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
