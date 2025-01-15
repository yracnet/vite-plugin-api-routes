import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
//import apiRoutes from "vite-plugin-api-routes";
import apiRoutes from "../../plugin/src/index";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiRoutes({
      mode: "isolated",
      configure: "src/server/configure.js",
      dirs: [
        {
          dir: "src/server/api",
          route: "",
        },
      ],
    }),
  ],
});
