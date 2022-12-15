import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import pluginReact from "@vitejs/plugin-react";
//@ts-ignore
import { pluginAPI } from "../plugin-api/src";
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
      outDir: "dist/server",
      // entry: "src/entry-server.js",
      dirs: [
        // {
        //   dir: "./src/api/v1",
        //   route: "v1",
        // },
        {
          dir: "./src/api/v2",
          route: "v2",
        },
      ],
    }),
    //Plugin Development
    fullReload(["**/*.ts", "**/*.js"], { root: "../plugin-api/src" }),
    //Remix ChunkSplit
    chunkSplitPlugin({
      customChunk: (args) => {
        const isApiBuild = process.env.IS_API_BUILD;
        if (isApiBuild) {
          const { file } = args;
          if (file === "virtual:api-router") {
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
