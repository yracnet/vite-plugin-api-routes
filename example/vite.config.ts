import pluginReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
//import pluginAPI from "../src";
import { pluginAPI } from "vite-plugin-api";

// https://vitejs.dev/config/
export default defineConfig({
  base: "myapp",
  build: {
    minify: false,
    outDir: "dist/public",
  },
  plugins: [
    pluginReact(),
    pluginAPI({
      //server: "src/server.ts",
      minify: false,
    }),
    //Remix ChunkSplit
    chunkSplitPlugin({
      strategy: "unbundle",
      customChunk: (args) => {
        const { file } = args;
        if (file == ".api/server.js") {
          return null;
        }
        return "routers";
      },
    }),
  ],
});
