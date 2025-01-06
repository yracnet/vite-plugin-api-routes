import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import apiRoutes from "vite-plugin-api-routes";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiRoutes({
      configure: "src/server/configure.js",
      dirs: [
        {
          dir: "src/server/api",
        },
      ],
      minify: false,
    }),
  ],
});
