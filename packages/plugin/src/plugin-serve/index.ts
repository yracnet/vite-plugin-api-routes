import express from "express";
import path from "slash-path";
import { PluginOption } from "vite";
import { ApiConfig } from "../model";

export const apiRoutesServe = (apiConfig: ApiConfig): PluginOption => {
  return {
    name: "vite-plugin-api-routes:serve",
    enforce: "pre",
    apply: "serve",
    config: () => {
      return {
        build: {
          watch: {
            exclude: [
              apiConfig.cacheDir
            ],
          },
        }
      };
    },
    configureServer: async (devServer) => {
      const {
        //
        config: vite,
        middlewares,
        ssrLoadModule,
        ssrFixStacktrace,
      } = devServer;
      const baseApi = path.join(vite.base, apiConfig.routeBase);
      const { viteServerBefore, viteServerAfter } = await ssrLoadModule(
        apiConfig.configureFile,
        {
          fixStacktrace: true,
        }
      );

      var appServer = express();
      //@ts-ignore
      viteServerBefore?.(appServer, devServer, vite);
      // Register Proxy After Vite Inicialize
      appServer.use("/", async (req, res, next) => {
        try {
          const { handler } = await ssrLoadModule(apiConfig.handlerFile, {
            fixStacktrace: true,
          });
          handler(req, res, next);
        } catch (error) {
          ssrFixStacktrace(error as Error);
          process.exitCode = 1;
          next(error);
        }
      });
      //@ts-ignore
      viteServerAfter?.(appServer, devServer, vite);
      middlewares.use(baseApi, appServer);
    },
  };
};
