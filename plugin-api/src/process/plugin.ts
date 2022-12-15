import { ResolvedConfig, ViteDevServer, build, InlineConfig } from "vite";
//@ts-ignore
import { applyDevServer } from "./runtime/dev-server";
import { assertPluginConfig } from "./config";
import { createRouters } from "./router";
import { generateCodeRouter } from "./stringify";
import { slashRelative } from "./util";

export type APIOptions = {
  entry?: string;
  dirs?: { dir: string; route: string }[];
  include?: string[];
  exclude?: string[];
  fnVerbs?: { [k: string]: string };
  baseRoute?: string;
  moduleId?: string;
  outDir?: string;
  preBuild?: (config: InlineConfig) => InlineConfig;
};

export type BuildAPI = {
  setupServer: (server: ViteDevServer) => void;
  resolveId: (id: string) => string | null;
  generateCode: (id: string) => string | null;
  writeBundle: () => void;
};

export const createBuildAPI = (
  opts: APIOptions,
  vite: ResolvedConfig
): BuildAPI => {
  const config = assertPluginConfig(opts, vite);
  return {
    setupServer: (devServer) => {
      applyDevServer(devServer, config);
    },
    resolveId: (id: string) => {
      if (id === config.moduleId) {
        return id;
      }
      return null;
    },
    generateCode: (id) => {
      if (id === config.moduleId) {
        const routes = createRouters(config);
        return generateCodeRouter(routes, config);
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
