import { ResolvedConfig, ViteDevServer, build } from "vite";
import {
  PluginOptions,
  assertPluginConfig,
  HANDLER_ID,
  CONFIG_ID,
  VIRTUAL_ID,
  SERVER_ID,
  ROUTER_ID,
} from "./config";
import { generateCodeConfig, generateCodeRouter } from "./stringify";
import { slashRelative } from "./util";
import polka from "polka";

export type BuildAPI = {
  setupServer: (server: ViteDevServer) => void;
  resolveId: (id: string) => any | null;
  generateCode: (id: string) => string | null;
  writeBundle: () => void;
};

export const createBuildAPI = (
  opts: PluginOptions,
  vite: ResolvedConfig
): BuildAPI => {
  const config = assertPluginConfig(opts, vite);
  return {
    setupServer: (devServer) => {
      devServer.middlewares.use(async (req: any, res: any, next) => {
        try {
          const handlerId = `/@id/${config.moduleId}:handler`;
          const mod = await devServer.ssrLoadModule(handlerId);
          const server = polka({
            onNoMatch: () => next(),
          });
          if (Array.isArray(mod.handler)) {
            mod.handler.forEach((it) => server.use(it));
          } else {
            server.use(mod.handler);
          }
          server.handler(req, res);
        } catch (error) {
          devServer.ssrFixStacktrace(error as Error);
          process.exitCode = 1;
          next(error);
        }
      });
    },
    resolveId: (id: string) => {
      if (id.startsWith(config.moduleId)) {
        id = id.replace(config.moduleId, VIRTUAL_ID);
      }
      if (id === ROUTER_ID || id === CONFIG_ID) {
        return id;
      } else if (id === SERVER_ID) {
        console.log("\nresolveId:SERVER_ID ", id);
        return {
          external: "relative",
          id: config.entry,
        };
      } else if (id === HANDLER_ID) {
        console.log("\nresolveId:HANDLER_ID ", id);
        return {
          external: "relative",
          id: config.handler,
        };
      }
      return null;
    },
    generateCode: (id) => {
      if (id === ROUTER_ID) {
        return generateCodeRouter(config);
      } else if (id === CONFIG_ID) {
        return generateCodeConfig(config);
      }
      return null;
    },

    writeBundle: async () => {
      if (process.env.IS_API_BUILD) return;
      process.env.IS_API_BUILD = "true";
      const { root, outDir } = config;
      const clientDir = slashRelative(outDir, vite.build.outDir);
      const viteServer = await config.preBuild({
        root,
        mode: vite.mode,
        publicDir: "private",
        // resolve: {
        //   alias: {
        //     [SERVER_ID]: config.entry,
        //     [HANDLER_ID]: config.handler,
        //   },
        // },
        define: {
          "import.meta.env.CLIENT_DIR": clientDir,
        },
        build: {
          outDir,
          ssr: true,
          // minify: true,
          assetsDir: "",
          target: "es2020",
          rollupOptions: {
            input: {
              app: config.entry,
              handler: config.handler,
            },
            external: vite.build?.rollupOptions?.external,
            output: {
              format: "es",
            },
          },
        },
        optimizeDeps: {
          include: ["vite-plugin-api", "../plugin-api"],
        },
      });
      await build(viteServer);
    },
  };
};
