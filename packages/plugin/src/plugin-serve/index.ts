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
      const baseApi = path.join(devServer.config.base, apiConfig.routeBase);
      // Execute Once
      const appConfig = await devServer.ssrLoadModule(
        apiConfig.configureFile,
        {
          fixStacktrace: true,
        }
      );
      const appProxy = express();
      //@ts-ignore
      appConfig.viteServerBefore?.(appProxy, devServer, vite);
      appProxy.use(async (req, res, next) => {
        try {
          const mod = await devServer.ssrLoadModule(apiConfig.handlerFile, {
            fixStacktrace: true,
          });
          mod.handler(req, res, next);
        } catch (error) {
          devServer.ssrFixStacktrace(error as Error);
          process.exitCode = 1;
          next(error);
        }
      });
      //@ts-ignore
      appConfig.viteServerAfter?.(appProxy, devServer, vite);
      return () => {
        devServer.middlewares.use(baseApi, appProxy);
      }
    },
  };
};
