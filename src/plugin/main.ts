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
    name: "vite-plugin-api",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [`${config.moduleId}/server`]: config.serverFile,
            [`${config.moduleId}/handler`]: config.handlerFile,
            [`${config.moduleId}/routers`]: config.routersFile,
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
    configureServer: (devServer) => {
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
          restart();
        }
      };
      watcher.on("add", onReload);
      watcher.on("change", onReload);
      const baseApi = path.join(vite.base, config.routeBase);
      middlewares.use(baseApi, async (req: any, res, next) => {
        try {
          const module = await ssrLoadModule(config.handler);
          module.handler(req, res);
        } catch (error) {
          ssrFixStacktrace(error as Error);
          process.exitCode = 1;
          next(error);
        }
      });
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
          "import.meta.env.PUBLIC_DIR": publicDir,
          "import.meta.env.BASE": vite.base,
          "import.meta.env.BASE_APÎ": path.join(vite.base, routeBase),
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
                warning.id === config.routersFile
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
