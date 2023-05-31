import { ResolvedConfig, ViteDevServer, build } from "vite";
import {
  UserConfig,
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
  opts: UserConfig,
  vite: ResolvedConfig
): BuildAPI => {
  const config = assertPluginConfig(opts, vite);
  return {
    setupServer: (devServer) => {
      devServer.middlewares.use(async (req: any, res: any, next) => {
        try {
          const mod = await devServer.ssrLoadModule(`/@id/${HANDLER_ID}`);
          const server = polka({
            onNoMatch: () => next(),
          });
          server.use(mod.handler);
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
        return config.entry;
      } else if (id === HANDLER_ID) {
        return config.handler;
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
      const { root, outDir, minify } = config;
      const clientDir = slashRelative(outDir, vite.build.outDir);
      const viteServer = await config.preBuild({
        root,
        mode: vite.mode,
        publicDir: "private",
        define: {
          "import.meta.env.CLIENT_DIR": clientDir,
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
              app: config.entry,
            },
            external: vite.build?.rollupOptions?.external,
            output: {
              format: "es",
            },
          },
        },
      });
      await build(viteServer);
    },
  };
};
