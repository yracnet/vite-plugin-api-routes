import path from "slash-path";
import { Plugin } from "vite";
import { ApiConfig } from "../model";

export const apiRoutesServe = (config: ApiConfig): Plugin => {
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
      //@ts-ignore
      viteServerBefore?.(devServer.middlewares, devServer, vite);
      // Register Proxy After Vite Inicialize
      middlewares.use(baseApi, async (req, res, next) => {
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
      viteServerAfter?.(devServer.middlewares, devServer, vite);
    },
  };
};
