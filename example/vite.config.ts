import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import pluginReact from "@vitejs/plugin-react";
//@ts-ignore
import { pluginAPI } from "../src";
//import { pluginAPI } from "vite-plugin-api";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    outDir: "dist/client",
    rollupOptions: {
      external: ["express", "dotenv"],
    },
  },
  plugins: [
    pluginReact(),
    pluginAPI({
      moduleId: "virtual:custom",
      outDir: "dist/server",
      minify: false,
      //entry: "src/entry-server.js",
      //handler: "src/handler.js",
      dirs: [
        {
          dir: "./src/api/dev",
          route: "dev",
        },
        // {
        //   dir: "./src/api/v1",
        //   route: "v1",
        // },
        {
          dir: "./src/api/v2",
          route: "v2",
          exclude: ["**/data"],
        },
      ],
      mapper: {
        // default: false,
        // // GET: false,
        // // POST: false,
        // // PUT: false,
        // PATCH: false,
        // DELETE: false,
        // HOC: "use",
        // PING: "get",
        // CREATE: "over",
        // UPDATE: "over",
        // REMOVE: "over",
      },
    }),
    //Plugin Development
    fullReload(["**/*.ts", "**/*.js"], { root: "../plugin-api/src" }),
    //Remix ChunkSplit
    chunkSplitPlugin({
      customChunk: (args) => {
        const { file } = args;
        const isApiBuild = process.env.IS_API_BUILD;
        if (isApiBuild) {
          if (file.startsWith("virtual:vite-plugin-api")) {
            return "api";
          } else if (/src\/api/.test(file)) {
            return file.replace("src/api", "api");
          }
        }
        return null;
      },
    }),
  ],
});
