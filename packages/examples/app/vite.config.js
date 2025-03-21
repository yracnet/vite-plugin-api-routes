import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
//import apiRoutes from "vite-plugin-api-routes";
import apiRoutes from "../../plugin/src/index";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiRoutes({
      configure: "src/server/configure.js",
      mapper: {
        AUTH: {
          method: "use",
          priority: 10,
        },
        ERROR: {
          method: "use",
          priority: 110,
        },
      },
      dirs: [
        {
          dir: "src/server/api",
          route: "",
        },
      ],
    }),
  ],
});
