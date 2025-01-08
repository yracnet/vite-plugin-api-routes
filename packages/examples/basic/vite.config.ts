import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
//import apiRoutes from "vite-plugin-api-routes";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import apiRoutes from "../../plugin/src";

// https://vitejs.dev/config/
export default defineConfig({
  base: "myapp",
  build: {
    minify: false,
    outDir: "dist/public",
  },
  plugins: [
    react(),
    apiRoutes({
      //server: "src/custom-server-example/server.ts",
      //handler: "src/custom-server-example/handler.ts",
      configure: "src/custom-server-example/configure.ts",
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
