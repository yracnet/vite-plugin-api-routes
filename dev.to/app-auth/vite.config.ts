import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import api from "vite-plugin-api-routes";
import ts from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ts(),
    react(),
    api({
      mode: "isolated",
      //configure: "src/server/configure.js",
      mapper: {
        AUTH: { method: "use", priority: 11 },
        CRUD: { method: "use", priority: 12 },
        ERROR: { method: "use", priority: 110 },
      },
      dirs: [
        { dir: "src/server/api-admin", route: "admin" },
        { dir: "src/server/api-auth", route: "auth" },
        { dir: "src/server/api-dev", route: "_", skip: "production" },
      ],
    }),
  ],
});
