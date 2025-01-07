import { defineConfig } from "tsup";

export default defineConfig([
  // {
  //   entry: ["src/index.ts", "src/model.ts"],
  //   format: ["cjs", "esm"],
  //   outDir: "dist",
  //   external: ["vite", "express", "fast-glob", "slash-path"],
  //   dts: true,
  //   clean: true,
  //   sourcemap: false,
  //   minify: false,
  // },
  {
    entry: [
      "src/api-server/configure.ts",
      "src/api-server/handler.ts",
      "src/api-server/routers.ts",
      "src/api-server/server.ts",
      "src/api-server/types.ts",
    ],
    format: ["esm"],
    outDir: ".api",
    external: [
      "vite",
      "express",
      "fast-glob",
      "slash-path",
      "@api/configure",
      "@api/handler",
      "@api/routers",
      "@api/server",
    ],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    target: "esnext",
  },
]);
