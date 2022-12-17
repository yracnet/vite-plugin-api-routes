import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { APIOptions, BuildAPI, createBuildAPI } from "./plugin/main";

export const pluginAPI = (apiOptions: APIOptions): Plugin => {
  let ctx: BuildAPI;
  return {
    name: "vite-plugin-api",
    enforce: "pre",
    async configResolved(config: ResolvedConfig) {
      ctx = createBuildAPI(apiOptions, config);
    },
    configureServer(server: ViteDevServer) {
      ctx.setupServer(server);
    },
    resolveId(id: string) {
      return ctx.resolveId(id);
    },
    async load(id: string) {
      return ctx.generateCode(id);
    },
    async writeBundle() {
      ctx.writeBundle();
    },
  };
};
