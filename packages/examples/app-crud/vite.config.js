import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import apiRoutes from "vite-plugin-api-routes";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiRoutes({
      mode: "isolated",
      configure: "src/server/configure.js", // Path to the configuration file
      dirs: [
        {
          dir: "src/server/api", // Path to the APIs
          route: "",
        },
      ],
    }),
  ],
});
