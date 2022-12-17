import { assertRoutePath } from "./router";
import { slash, slashJoin, slashResolve, slashResolveIfExist } from "./util";
import { InlineConfig, ResolvedConfig } from "vite";

export const VIRTUAL_ID = "virtual:vite-plugin-api";
export const ROUTER_ID = `${VIRTUAL_ID}:router`;
export const CONFIG_ID = `${VIRTUAL_ID}:config`;
export const SERVER_ID = `${VIRTUAL_ID}:server`;
export const HANDLER_ID = `${VIRTUAL_ID}:handler`;

export type FileRouter = {
  file: string;
  route: string;
};

export type DirRoute = {
  dir: string;
  route: string;
};

export type FnMapper = {
  method: string;
  fn: string;
};

export type PluginOptions = {
  entry?: string;
  handler?: string;
  dirs?: DirRoute[];
  include?: string[];
  exclude?: string[];
  fnMapper?: { [k: string]: string | false };
  routeBase?: string;
  moduleId?: string;
  outDir?: string;
  preBuild?: (config: InlineConfig) => InlineConfig;
};

export type PluginConfig = {
  id: string;
  root: string;
  routeBase: string;
  entry: string;
  handler: string;
  include: string[];
  exclude: string[];
  dirs: DirRoute[];
  fnMapper: FnMapper[];
  outDir: string;
  preBuild: (config: InlineConfig) => InlineConfig;
};

const defaultFile = (file: string) => {
  return slashJoin(__dirname, file);
};

export const assertPluginConfig = (
  opts: PluginOptions,
  vite: ResolvedConfig
): PluginConfig => {
  let {
    entry,
    handler,
    dirs = [{ dir: "src/api", route: "" }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    fnMapper: fnMap = {},
    routeBase = "api",
    moduleId: id = VIRTUAL_ID,
    outDir = "dist/server",
    preBuild = (v: InlineConfig) => v,
  } = opts;

  routeBase = "/" + slash(routeBase);
  const root = slash(vite.root);
  outDir = slashResolve(root, outDir);

  entry = slashResolveIfExist(root, entry) || defaultFile("runtime/server.js");
  handler =
    slashResolveIfExist(root, handler) || defaultFile("runtime/handler.js");

  exclude = [...exclude, "node_modules", ".git"];

  fnMap = {
    default: "use",
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...fnMap,
  };

  const fnMapper = <FnMapper[]>Object.entries(fnMap)
    .map(([fn, method]) => ({
      fn,
      method,
    }))
    .filter((it) => it.method);

  dirs = dirs.map(({ dir, route }) => {
    dir = slashResolve(root, dir);
    route = assertRoutePath(route);
    return { route, dir };
  });

  return {
    id,
    root,
    entry,
    handler,
    routeBase,
    dirs,
    include,
    exclude,
    outDir,
    preBuild,
    fnMapper,
  };
};
