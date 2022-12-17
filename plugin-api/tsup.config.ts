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
    entry: ["src/process/runtime/app-server.js"],
    format: "esm",
    external: ["virtual:api-router:router", "express", "dotenv"],
    outDir: "dist/runtime",
    clean: true,
    sourcemap: false,
  },
]);
