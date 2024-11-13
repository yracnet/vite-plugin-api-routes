import path from "slash-path";
import { PluginOption, build } from "vite";
import { PluginConfig } from "./types";
import { generateReload, generateStart } from "./write";

export const pluginImpl = (config: PluginConfig): PluginOption => {
  const isReload = (file: string) => {
    file = path.slash(file);
    return config.watcherList.find((it) => file.startsWith(it));
  };
  //@ts-ignore
  let vite: ResolvedConfig = {};
  return {
    name: "vite-plugin-api-routes",
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
      vite = viteConfig;
      generateStart(config, vite);
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
        middlewares,
        ssrLoadModule,
        ssrFixStacktrace,
        restart,
      } = devServer;
      const onReload = (file: string) => {
        if (isReload(file)) {
          generateReload(config, vite);
          watcher.off("add", onReload);
          watcher.off("change", onReload);
          restart(true);
        }
      };
      watcher.on("add", onReload);
      watcher.on("change", onReload);
      const baseApi = path.join(vite.base, config.routeBase);
      const configure = await ssrLoadModule(config.configure, {
        fixStacktrace: true,
      });
      //@ts-ignore
      configure.viteServerBefore?.(devServer.middlewares, devServer, vite);
      return () => {
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
        configure.viteServerAfter?.(devServer.middlewares, devServer, vite);
      };
    },
    writeBundle: async () => {
      if (process.env.IS_API_BUILD) return;
      generateStart(config, vite);
      process.env.IS_API_BUILD = "true";
      const { root, outDir, minify, preBuild, routeBase } = config;
      const publicDir = path.relative(outDir, vite.build.outDir);
      const viteServer = await preBuild({
        root,
        mode: vite.mode,
        publicDir: "private",
        define: {
          "API_ROUTES.BASE": JSON.stringify(vite.base),
          "API_ROUTES.BASE_API": JSON.stringify(
            path.join(vite.base, routeBase)
          ),
          "API_ROUTES.PUBLIC_DIR": JSON.stringify(publicDir),
        },
        build: {
          outDir,
          ssr: true,
          minify,
          target: "es2020",
          assetsDir: "",
          emptyOutDir: true,
          rollupOptions: {
            input: {
              app: config.server,
            },
            external: vite.build?.rollupOptions?.external,
            output: {
              format: "es",
            },
            onwarn: (warning: any, handler: any) => {
              if (
                warning.code === "MISSING_EXPORT" &&
                warning.id.startsWith(config.cacheDir)
              ) {
                return;
              }
              handler(warning);
            },
          },
        },
      });
      await build(viteServer);
    },
  };
};
