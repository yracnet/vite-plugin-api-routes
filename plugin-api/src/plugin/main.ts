import { ResolvedConfig, ViteDevServer, build } from "vite";
//@ts-ignore
import { applyDevServer } from "./runtime/dev-server";
import {
  PluginOptions,
  assertPluginConfig,
  HANDLER_ID,
  CONFIG_ID,
  VIRTUAL_ID,
  SERVER_ID,
  ROUTER_ID,
} from "./config";
import { createRouters } from "./router";
import { generateCodeConfig, generateCodeRouter } from "./stringify";
import { slashRelative } from "./util";

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
      applyDevServer(devServer, config);
    },
    resolveId: (id: string) => {
      if (id.startsWith(config.id)) {
        id = id.replace(config.id, VIRTUAL_ID);
      }
      if (id === ROUTER_ID || id === CONFIG_ID) {
        return id;
      } else if (id === SERVER_ID) {
        return {
          external: "absolute",
          id: config.entry,
        };
      } else if (id === HANDLER_ID) {
        return {
          external: "absolute",
          id: config.handler,
        };
      }
      return null;
    },
    generateCode: (id) => {
      if (id === ROUTER_ID) {
        const routes = createRouters(config);
        return generateCodeRouter(routes, config);
      } else if (id === CONFIG_ID) {
        const routes = createRouters(config);
        return generateCodeConfig(routes, config);
      }
      return null;
    },

    writeBundle: async () => {
      if (process.env.IS_API_BUILD) return;
      process.env.IS_API_BUILD = "true";
      const { entry, root, outDir } = config;
      const clientDir = slashRelative(outDir, vite.build.outDir);
      const viteServer = await config.preBuild({
        root,
        mode: vite.mode,
        publicDir: "private",
        build: {
          outDir,
          ssr: true,
          assetsDir: "",
          target: "es2015",
          rollupOptions: {
            input: {
              app: entry,
            },
            external: vite.build?.rollupOptions?.external,
          },
        },
        define: {
          "process.env.CLIENT_DIR": clientDir,
        },
      });
      await build(viteServer);
    },
  };
};
