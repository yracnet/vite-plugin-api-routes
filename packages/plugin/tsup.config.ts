import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    external: ["vite", "express", "fast-glob", "slash-path"],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
  },
  {
    entry: [
      "src/api-server/configure.ts",
      "src/api-server/handler.ts",
      "src/api-server/routers.ts",
      "src/api-server/server.ts",
      "src/api-server/env.ts",
    ],
    format: ["esm"],
    outDir: ".api",
    external: [
      "vite",
      "express",
      "fast-glob",
      "slash-path",
      "vite-plugin-api-routes/configure",
      "vite-plugin-api-routes/handler",
      "vite-plugin-api-routes/routers",
      "vite-plugin-api-routes/server",
    ],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    target: "esnext",
  },
]);
