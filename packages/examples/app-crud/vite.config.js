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
      configure: "src/server/configure.js", // Path to the configuration file
      mapper: {
        AUTH: {
          method: "use",
          priority: 11,
        },
        ERROR: {
          method: "use",
          priority: 110,
        },
      },
      dirs: [
        {
          dir: "src/server/api", // Path to the APIs
          route: "",
        },
        //PROD AND DEV SWITCH
        {
          dir: "src/server/api-dev",
          route: "admin",
          skip: "production",
        },
        {
          dir: "src/server/api-prod",
          route: "admin",
          skip: "development",
        },
      ],
    }),
  ],
});
