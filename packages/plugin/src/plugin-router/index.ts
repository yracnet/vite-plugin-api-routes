import path from "slash-path";
import { PluginOption } from "vite";
import { ApiConfig } from "../model";
import { writeHandlerFile } from "./writeHandlerFile";
import { writeOpenapiFile } from "./writeOpenapiFile";

export const apiRoutesRoute = (apiConfig: ApiConfig): PluginOption => {
  const isReload = (file: string) => {
    file = path.slash(file);
    return apiConfig.watcherList.find((it) => file.startsWith(it));
  };
  return {
    name: "vite-plugin-api-router:router",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [`${apiConfig.moduleId}/server`]: apiConfig.serverFile,
            [`${apiConfig.moduleId}/handler`]: apiConfig.handlerFile,
            [`${apiConfig.moduleId}/configure`]: apiConfig.configureFile,
          },
        },
      };
    },
    configResolved: (viteConfig) => {
      writeHandlerFile(apiConfig, viteConfig);
      writeOpenapiFile(apiConfig, viteConfig);
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
      const onReload = (_event: string, file: string) => {
        if (isReload(file)) {
          writeHandlerFile(apiConfig, viteConfig);
          writeOpenapiFile(apiConfig, viteConfig);
          if (apiConfig.forceRestart) {
            watcher.off("all", onReload);
            restart(true);
          }
        }
      };
      watcher.on("all", onReload);
    },
  };
};
