import pluginReact from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import apiRoutes from "vite-plugin-api-routes";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

// https://vitejs.dev/config/
export default defineConfig({
  base: "myapp",
  build: {
    minify: false,
    outDir: "dist/public",
  },
  plugins: [
    pluginReact(),
    apiRoutes({
      //server: "src/custom-server-example/server.ts",
      //handler: "src/custom-server-example/handler.ts",
      configure: "src/custom-server-example/configure.ts",
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
