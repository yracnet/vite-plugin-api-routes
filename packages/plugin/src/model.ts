import path from "slash-path";
import { InlineConfig } from "vite";

export type DirRoute = {
  dir: string;
  route: string;
  exclude?: string[];
  skip?: "development" | "production" | string | boolean;
};

export type Mapper = {
  order: number;
  name: string;
  method: string;
};

type MethodConfig = { name: string; method: string; priority: number };

export type ApiConfig = {
  moduleId: string;
  mode: "legacy" | "isolated";
  server: string;
  handler: string;
  configure: string;
  serverFile: string;
  handlerFile: string;
  routersFile: string;
  configureFile: string;
  dirs: DirRoute[];
  include: string[];
  exclude: string[];
  mapper: {
    [k: string]: false | string | { method: string; priority: number };
  };
  mapperList: MethodConfig[];
  watcherList: string[];
  routeBase: string;
  root: string;
  cacheDir: string;
  disableBuild: boolean;
  clientOutDir: string;
  clientMinify: boolean | "terser" | "esbuild";
  clientBuild: (config: InlineConfig) => InlineConfig;
  serverOutDir: string;
  serverMinify: boolean | "terser" | "esbuild";
  serverBuild: (config: InlineConfig) => InlineConfig;
};

export type ApiOpts = Partial<
  Omit<
    ApiConfig,
    | "serverFile"
    | "handlerFile"
    | "configureFile"
    | "routersFile"
    | "mapperList"
    | "watcherList"
    | "config"
    | "routers"
  >
>;

export const assertConfig = (opts: ApiOpts): ApiConfig => {
  let {
    moduleId = "@api",
    mode = "legacy",
    root = process.cwd(),
    cacheDir = ".api",
    server = path.join(cacheDir, "server.js"),
    handler = path.join(cacheDir, "handler.js"),
    configure = path.join(cacheDir, "configure.js"),
    routeBase = "api",
    dirs = [{ dir: "src/api", route: "", exclude: [], skip: false }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    mapper = {},
    disableBuild = false,
    clientOutDir = "dist/client",
    clientMinify = false,
    clientBuild = (config: InlineConfig) => config,
    serverOutDir = "dist",
    serverMinify = false,
    serverBuild = (config: InlineConfig) => config,
  } = opts;
  if (moduleId !== "@api") {
    console.warn("The moduleId will be remove in the next release");
  }
  if (cacheDir !== ".api") {
    console.warn("The cacheDir will be remove in the next release");
  }
  cacheDir = path.join(root, cacheDir);

  dirs = dirs.map((it) => {
    it.dir = path.join(root, it.dir);
    return it;
  });

  mapper = {
    default: { method: "use", priority: 0 },
    USE: { method: "use", priority: 10 },
    GET: { method: "get", priority: 20 },
    POST: { method: "post", priority: 30 },
    PATCH: { method: "patch", priority: 40 },
    PUT: { method: "put", priority: 50 },
    DELETE: { method: "delete", priority: 60 },
    // Overwrite
    ...mapper,
  };
  if (mode === "isolated") {
    delete mapper.default;
  }
  routeBase = path.join("/", routeBase);
  clientOutDir = path.join(root, clientOutDir);
  serverOutDir = path.join(root, serverOutDir);
  const serverFile = path.join(root, server);
  const handlerFile = path.join(root, handler);
  const routersFile = path.join(cacheDir, "routers.js");
  const configureFile = path.join(root, configure);

  const mapperList: MethodConfig[] = Object.entries(mapper)
    .map(([name, value], ix) => {
      if (value === false) {
        return {
          name,
          method: "",
          priority: 0,
        };
      }
      if (typeof value === "string") {
        return {
          name,
          method: value,
          priority: ix + 1,
        };
      }
      return {
        name,
        method: value.method,
        priority: value.priority,
      };
    })
    .filter((it) => it.method !== "");
  if (mode === "isolated") {
    include = mapperList.map((it) => `**/${it.name}.{js,ts}`);
  }
  const watcherList = dirs.map((it) => it.dir);
  //watcherList.push(routersFile);
  watcherList.push(configureFile);
  watcherList.push(handlerFile);

  return {
    mode,
    moduleId,
    server,
    handler,
    configure,
    root,
    serverFile,
    handlerFile,
    routersFile,
    configureFile,
    routeBase,
    dirs,
    include,
    exclude,
    mapper,
    mapperList,
    watcherList,
    cacheDir,
    disableBuild,
    clientOutDir,
    clientMinify,
    clientBuild,
    serverOutDir,
    serverMinify,
    serverBuild,
  };
};
