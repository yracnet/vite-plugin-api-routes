import express from "express";
import path from "slash-path";
import { PluginOption } from "vite";
import { ApiConfig } from "../model";

export const apiRoutesServe = (config: ApiConfig): PluginOption => {
  return {
    name: "vite-plugin-api-routes:serve",
    enforce: "pre",
    apply: "serve",
    configureServer: async (devServer) => {
      const {
        //
        config: vite,
        middlewares,
        ssrLoadModule,
        ssrFixStacktrace,
      } = devServer;
      const baseApi = path.join(vite.base, config.routeBase);
      const { viteServerBefore, viteServerAfter } = await ssrLoadModule(
        config.configure,
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
          const { handler } = await ssrLoadModule(config.handler, {
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
