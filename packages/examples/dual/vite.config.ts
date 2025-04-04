import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
//import apiRoutes from "vite-plugin-api-routes";
import apiRoutes from "../../plugin/src";

// https://vite.dev/config/
export default defineConfig({
  base: "/myapp",
  plugins: [
    react(),
    apiRoutes({
      mode: "legacy",
      cacheDir: ".api-legacy",
      disableBuild: true,
      serverMinify: true,
      mapper: {
        AUTH: {
          method: "use",
          priority: 11,
        },
        ERROR: {
          method: "use",
          priority: 120,
        },
        LOGGER: {
          method: "use",
          priority: 31,
        },
      },
      dirs: [
        {
          dir: "src/api-legacy",
          route: "",
        },
      ],
    }),
    apiRoutes({
      mode: "isolated",
      cacheDir: ".api-isolated",
      serverMinify: true,
      mapper: {
        AUTH: {
          method: "use",
          priority: 11,
        },
        ERROR: {
          method: "use",
          priority: 120,
        },
        LOGGER: {
          method: "use",
          priority: 31,
        },
      },
      dirs: [
        {
          dir: "src/api-isolated",
          route: "",
        },
      ],
    }),
  ],
});
