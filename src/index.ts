import path from "slash-path";
import { InlineConfig } from "vite";
import { pluginImpl } from "./plugin/main";
import { Mapper, UserConfig } from "./plugin/types";

export const pluginAPIRoutes = (opts: UserConfig = {}) => {
  let {
    moduleId = "@api",
    cacheDir = ".api",
    root = process.cwd(),
    server = path.join(cacheDir, "server.js"),
    handler = path.join(cacheDir, "handler.js"),
    configure = path.join(cacheDir, "configure.js"),
    routeBase = "api",
    dirs = [{ dir: "src/api", route: "", exclude: [] }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    mapper = {},
    outDir = "dist/server",
    minify = true,
    preBuild = (v: InlineConfig) => v,
  } = opts;

  dirs = dirs.map((it) => {
    it.dir = path.join(root, it.dir);
    return it;
  });

  mapper = {
    default: "use",
    GET: "get",
    PUT: "put",
    POST: "post",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...mapper,
  };
  routeBase = path.join("/", routeBase);
  outDir = path.join(root, outDir);
  cacheDir = path.join(root, cacheDir);
  const serverFile = path.join(root, server);
  const handlerFile = path.join(root, handler);
  const routersFile = path.join(cacheDir, "routers.js");
  const typesFile = path.join(cacheDir, "types.d.ts");
  const configureFile = path.join(root, configure);

  const mapperList = Object.entries(mapper)
    .filter((it) => it[1])
    .map(([name, method]) => {
      return <Mapper>{
        name,
        method,
      };
    });
  const watcherList = dirs.map((it) => it.dir);
  watcherList.push(cacheDir);
  watcherList.push(serverFile);
  watcherList.push(handlerFile);

  return pluginImpl({
    moduleId,
    server,
    handler,
    configure,
    root,
    serverFile,
    handlerFile,
    routersFile,
    typesFile,
    configureFile,
    routeBase,
    dirs,
    include,
    exclude,
    mapper,
    mapperList,
    watcherList,
    outDir,
    cacheDir,
    minify,
    preBuild,
  });
};

export const pluginAPI = pluginAPIRoutes;

export const createAPI = pluginAPIRoutes;

export default pluginAPIRoutes;
