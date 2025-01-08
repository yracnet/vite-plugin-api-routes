import react from "@vitejs/plugin-react-swc";
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
    react(),
    //@ts-ignore
    apiRoutes({
      disableBuild: false,
      server: "src/custom-server-example/server.ts",
      //handler: "src/custom-server-example/handler.ts",
      configure: "src/custom-server-example/configure.ts",
      serverBuild: (config) => {
        config.plugins = [
          //@ts-ignore
          chunkSplitPlugin({
            strategy: "unbundle",
            customChunk: (args) => {
              const { file } = args;
              if (file.startsWith("src/")) {
                return file.replace("src/", "");
              }
              if (file.startsWith(".api/")) {
                return file.replace(".api/", "");
              }
            },
          }),
        ];
        return config;
      },
    }),
  ],
});
