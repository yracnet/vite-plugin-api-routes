import path from "slash-path";
import { Plugin } from "vite";
import { PluginConfig } from "../model";
import { writeRoutersFile } from "./routersFile";

export const apiRoutesRoute = (config: PluginConfig): Plugin => {
  const isReload = (file: string) => {
    file = path.slash(file);
    return config.watcherList.find((it) => file.startsWith(it));
  };
  return {
    name: "vite-plugin-api-routes:route",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [`${config.moduleId}/root`]: config.root,
            [`${config.moduleId}/server`]: config.serverFile,
            [`${config.moduleId}/handler`]: config.handlerFile,
            [`${config.moduleId}/routers`]: config.routersFile,
            [`${config.moduleId}/configure`]: config.configureFile,
          },
        },
      };
    },
    configResolved: (viteConfig) => {
      writeRoutersFile(config, viteConfig);
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
          writeRoutersFile(config, viteConfig);
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
