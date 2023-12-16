import pluginReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import pluginRestAPI from "../src";
//import { pluginRestAPI } from "vite-plugin-rest-api";

// https://vitejs.dev/config/
export default defineConfig({
  base: "myapp",
  build: {
    minify: false,
    outDir: "dist/public",
  },
  plugins: [
    pluginReact(),
    pluginRestAPI({
      //server: "src/custom-server-example/server.ts",
      //handler: "src/custom-server-example/handler.ts",
      minify: false,
    }),
    //Remix ChunkSplit
    chunkSplitPlugin({
      strategy: "unbundle",
      customChunk: (args) => {
        const { file } = args;
        // If ROOT Script
        if (file == ".api/server.js") {
          return null;
        }
        return "routers";
      },
    }),
  ],
});
