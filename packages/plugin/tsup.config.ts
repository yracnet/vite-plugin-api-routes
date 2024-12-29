import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/model.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["vite", "express", "fast-glob", "slash-path"],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
  },
]);
