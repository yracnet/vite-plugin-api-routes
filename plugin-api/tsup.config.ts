import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["vite", "express"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
  {
    entry: ["src/plugin/runtime/server.js"],
    format: "cjs",
    external: [
      "virtual:vite-plugin-api:handler",
      "virtual:vite-plugin-api:router",
      "virtual:vite-plugin-api:config",
      "express",
      "dotenv",
    ],
    outDir: "dist/runtime",
    clean: true,
    sourcemap: false,
  },
  {
    entry: ["src/plugin/runtime/handler.js"],
    format: "cjs",
    external: [
      "virtual:vite-plugin-api:handler",
      "virtual:vite-plugin-api:router",
      "virtual:vite-plugin-api:config",
      "express",
      "dotenv",
    ],
    outDir: "dist/runtime",
    clean: true,
    sourcemap: false,
  },
]);
