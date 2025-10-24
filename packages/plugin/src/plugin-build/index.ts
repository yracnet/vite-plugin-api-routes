import path from "slash-path";
import { PluginOption, ResolvedConfig, build } from "vite";
import { ApiConfig } from "../model";
const ENTRY_NONE = "____.html";

const simplePath = (filePath: string) =>
  filePath
    .replace(/(\.[^\.]+)$/, "")
    .replace(/^[\/\\]/gi, "")
    .replace(/[\/\\]$/, "");

const doBuildServer = async (
  apiConfig: ApiConfig,
  viteConfig: ResolvedConfig
) => {
  const {
    root,
    serverOutDir,
    clientOutDir,
    serverMinify,
    serverBuild,
    routeBase,
    serverFile,
    configureFile,
    handlerFile,
    routersFile,
    cacheDir,
  } = apiConfig;
  const binFiles = [configureFile, handlerFile, routersFile];
  const clientDir = path.relative(serverOutDir, clientOutDir);
  const viteServer = await serverBuild({
    appType: "custom",
    root,
    publicDir: "private",
    define: {
      "API_ROUTES.BASE": JSON.stringify(viteConfig.base),
      "API_ROUTES.BASE_API": JSON.stringify(
        path.join(viteConfig.base, routeBase)
      ),
      "API_ROUTES.PUBLIC_DIR": JSON.stringify(clientDir),
    },
    build: {
      outDir: serverOutDir,
      ssr: serverFile,
      write: true,
      minify: serverMinify,
      target: "esnext",
      emptyOutDir: true,
      rollupOptions: {
        external: viteConfig.build?.rollupOptions?.external,
        output: {
          format: "es",
          entryFileNames: "app.js",
          chunkFileNames: "bin/[name]-[hash].js",
          assetFileNames: "assets/[name].[ext]",
          manualChunks: (id) => {
            const isApi = apiConfig.dirs.find((it) => id.includes(it.dir));
            if (isApi) {
              const file = path.join(
                apiConfig.routeBase || "",
                isApi.route || "",
                path.relative(isApi.dir, id)
              );
              return simplePath(file);
            }
            const isBin = binFiles.find((bin) => id.includes(bin));
            if (isBin) {
              return "index";
            }
            if (id.includes("node_modules")) {
              const pkg = id.split("node_modules/")[1];
              const lib = path.join("libs", pkg);
              return simplePath(lib);
            }
          },
        },
        onwarn: (warning: any, handler: any) => {
          if (
            warning.code === "MISSING_EXPORT" &&
            warning.id.startsWith(cacheDir)
          ) {
            return;
          }
          handler(warning);
        },
      },
    },
  });
  await build(viteServer);
};
const doBuildClient = async (
  apiConfig: ApiConfig,
  viteConfig: ResolvedConfig
) => {
  const { root, clientOutDir, clientMinify, clientBuild } = apiConfig;
  const preloadFiles = [
    "modulepreload-polyfill",
    "commonjsHelpers",
    "vite/",
    "installHook",
  ];
  const viteClient = await clientBuild({
    root,
    build: {
      outDir: clientOutDir,
      write: true,
      minify: clientMinify,
      emptyOutDir: true,
      rollupOptions: {
        external: viteConfig.build?.rollupOptions?.external,
        output: {
          manualChunks: (id) => {
            const isInternal = preloadFiles.find((it) => id.includes(it));
            if (isInternal) {
              return "preload";
            }
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  });
  await build(viteClient);
};

export const apiRoutesBuild = (apiConfig: ApiConfig): PluginOption => {
  if (apiConfig.disableBuild) {
    return null;
  }
  //@ts-ignore
  let viteConfig: ResolvedConfig = {};
  return {
    name: "vite-plugin-api-routes:build",
    enforce: "pre",
    apply: "build",
    config: () => {
      if (process.env.IS_API_ROUTES_BUILD) return {};
      return {
        build: {
          emptyOutDir: true,
          copyPublicDir: false,
          write: false,
          rollupOptions: {
            input: {
              main: ENTRY_NONE,
            },
          },
        },
      };
    },
    resolveId: (id) => {
      if (id === ENTRY_NONE) {
        return id;
      }
      return null;
    },
    load: (id) => {
      if (id === ENTRY_NONE) {
        return "";
      }
      return null;
    },
    configResolved: (config) => {
      viteConfig = config;
    },
    buildStart: async () => {
      if (process.env.IS_API_ROUTES_BUILD) return;
      process.env.IS_API_ROUTES_BUILD = "true";
      viteConfig.logger.info("");
      if (apiConfig.serverSkip) {
        viteConfig.logger.info("\x1b[1m\x1b[90mSERVER BUILD SKIPPED\x1b[0m");
      } else {
        viteConfig.logger.info("\x1b[1m\x1b[31mSERVER BUILD\x1b[0m");
        await doBuildServer(apiConfig, viteConfig);
      }
      viteConfig.logger.info("");
      if (apiConfig.clientSkip) {
        viteConfig.logger.info("\x1b[1m\x1b[90mCLIENT BUILD SKIPPED\x1b[0m");
      } else {
        viteConfig.logger.info("\x1b[1m\x1b[31mCLIENT BUILD\x1b[0m");
        await doBuildClient(apiConfig, viteConfig);
      }
      viteConfig.logger.info("");
      process.exit(0);
    },
  };
};
