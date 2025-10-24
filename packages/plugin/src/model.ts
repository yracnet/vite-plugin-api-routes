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

type MethodConfig = { name: string; method: string; priority: string };

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
  mapperList: MethodConfig[];
  filePriority: string;
  paramPriority: string;
  watcherList: string[];
  routeBase: string;
  root: string;
  cacheDir: string;
  forceRestart: boolean;
  disableBuild: boolean;
  clientOutDir: string;
  clientMinify: boolean | "terser" | "esbuild";
  clientBuild: (config: InlineConfig) => InlineConfig;
  clientSkip: boolean;
  serverOutDir: string;
  serverMinify: boolean | "terser" | "esbuild";
  serverBuild: (config: InlineConfig) => InlineConfig;
  serverSkip: boolean;
};

export type ApiOpts = {
  moduleId?: string;
  mode?: "legacy" | "isolated";
  server?: string;
  handler?: string;
  configure?: string;
  dirs?: DirRoute[];
  include?: string[];
  exclude?: string[];
  mapper?: {
    [k: string]: false | string | { method: string; priority: number };
  };
  filePriority?: number;
  paramPriority?: number;
  routeBase?: string;
  root?: string;
  cacheDir?: string;
  forceRestart?: boolean;
  disableBuild?: boolean;
  clientOutDir?: string;
  clientMinify?: boolean | "terser" | "esbuild";
  clientBuild?: (config: InlineConfig) => InlineConfig;
  clientSkip?: boolean;
  serverOutDir?: string;
  serverMinify?: boolean | "terser" | "esbuild";
  serverBuild?: (config: InlineConfig) => InlineConfig;
  serverSkip?: boolean;
};

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
    filePriority = 100,
    paramPriority = 110,
    forceRestart = false,
    disableBuild = false,
    clientOutDir = "dist/client",
    clientMinify = false,
    clientBuild = (config: InlineConfig) => config,
    clientSkip = !!process.argv.find(it => it === 'client-skip'),
    serverOutDir = "dist",
    serverMinify = false,
    serverBuild = (config: InlineConfig) => config,
    serverSkip = !!process.argv.find(it => it === 'server-skip'),
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
    default: { method: "use", priority: 10 },
    AUTH: { method: "use", priority: 11, },
    CRUD: { method: "use", priority: 12, },
    USE: { method: "use", priority: 20 },
    PING: { method: "get", priority: 21, },
    GET: { method: "get", priority: 30 },
    POST: { method: "post", priority: 40 },
    ACTION: { method: "post", priority: 41, },
    PATCH: { method: "patch", priority: 50 },
    PUT: { method: "put", priority: 60 },
    DELETE: { method: "delete", priority: 70 },
    ERROR: { method: "use", priority: 120, },
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
    .map(([name, value]) => {
      if (value === false) {
        return {
          name,
          method: "",
          priority: "000",
        };
      }
      if (typeof value === "string") {
        return {
          name,
          method: value,
          priority: "010",
        };
      }
      return {
        name,
        method: value.method,
        priority: value.priority.toString().padStart(3, "0"),
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
    filePriority: filePriority.toString().padStart(3, "0"),
    paramPriority: paramPriority.toString().padStart(3, "0"),
    configureFile,
    routeBase,
    dirs,
    include,
    exclude,
    mapperList,
    watcherList,
    cacheDir,
    forceRestart,
    disableBuild,
    clientOutDir,
    clientMinify,
    clientBuild,
    clientSkip,
    serverOutDir,
    serverMinify,
    serverBuild,
    serverSkip,
  };
};
