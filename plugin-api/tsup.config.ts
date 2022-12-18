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
    entry: ["src/process/runtime/server.js"],
    format: "esm",
    external: [
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
    entry: ["src/process/runtime/handler.js"],
    format: "esm",
    external: [
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
