import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["vite", "express", "fast-glob", "slash-path"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
