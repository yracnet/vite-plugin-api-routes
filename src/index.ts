import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { PluginOptions } from "./plugin/config";
import { BuildAPI, createBuildAPI } from "./plugin/main";
export { PluginConfig } from "./plugin/config";
export { FileRouter } from "./plugin/router";

export const pluginAPI = (apiOptions: PluginOptions): Plugin => {
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
