import path from "slash-path";
import { Plugin } from "vite";
import { ApiConfig } from "../model";
import { writeRoutersFile } from "./routersFile";

export const apiRoutesRoute = (apiConfig: ApiConfig): Plugin => {
  const isReload = (file: string) => {
    file = path.slash(file);
    return apiConfig.watcherList.find((it) => file.startsWith(it));
  };
  return {
    name: "vite-plugin-api-routes:route",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [`${apiConfig.moduleId}/root`]: apiConfig.root,
            [`${apiConfig.moduleId}/server`]: apiConfig.serverFile,
            [`${apiConfig.moduleId}/handler`]: apiConfig.handlerFile,
            [`${apiConfig.moduleId}/routers`]: apiConfig.routersFile,
            [`${apiConfig.moduleId}/configure`]: apiConfig.configureFile,
          },
        },
      };
    },
    configResolved: (viteConfig) => {
      writeRoutersFile(apiConfig, viteConfig);
    },
    handleHotUpdate: async (data) => {
      if (isReload(data.file)) {
        return [];
      }
    },
    configureServer: async (devServer) => {
      const {
        //
        watcher,
        restart,
        config: viteConfig,
      } = devServer;
      const onReload = (file: string) => {
        if (isReload(file)) {
          writeRoutersFile(apiConfig, viteConfig);
          watcher.off("add", onReload);
          watcher.off("change", onReload);
          restart(true);
        }
      };
      watcher.on("add", onReload);
      watcher.on("change", onReload);
    },
  };
};
