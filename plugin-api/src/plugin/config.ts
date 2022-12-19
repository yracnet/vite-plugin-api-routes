import { assertFileRoute } from "./router";
import {
  slash,
  slashJoin,
  slashRelative,
  slashResolve,
  slashResolveIfExist,
} from "./util";
import { InlineConfig, loadEnv, ResolvedConfig } from "vite";

export const VIRTUAL_ID = "virtual:vite-plugin-api";
export const ROUTER_ID = `virtual:vite-plugin-api:router`;
export const CONFIG_ID = `virtual:vite-plugin-api:config`;
export const SERVER_ID = `virtual:vite-plugin-api:server`;
export const HANDLER_ID = `virtual:vite-plugin-api:handler`;

export type DirRoute = {
  dir: string;
  route: string;
};

export type Mapper = {
  name: string;
  method: string;
};

export type PluginOptions = {
  entry?: string;
  handler?: string;
  dirs?: DirRoute[];
  include?: string[];
  exclude?: string[];
  mapper?: { [k: string]: string | false };
  routeBase?: string;
  moduleId?: string;
  outDir?: string;
  minify?: boolean;
  preBuild?: (config: InlineConfig) => InlineConfig;
};

export type PluginConfig = {
  moduleId: string;
  root: string;
  routeBase: string;
  entry: string;
  handler: string;
  include: string[];
  exclude: string[];
  dirs: DirRoute[];
  mapper: Mapper[];
  outDir: string;
  minify: boolean;
  preBuild: (config: InlineConfig) => InlineConfig;
};

const defaultFile = (file: string) => slashJoin(__dirname, file);

export const assertPluginConfig = (
  opts: PluginOptions,
  vite: ResolvedConfig
): PluginConfig => {
  const root = slash(vite.root);

  let {
    entry = defaultFile("runtime/server.js"),
    handler = defaultFile("runtime/handler.js"),
    dirs = [{ dir: "src/api", route: "" }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    mapper: map = {},
    routeBase = "api",
    moduleId = VIRTUAL_ID,
    outDir = "dist/server",
    minify = true,
    preBuild = (v: InlineConfig) => v,
  } = opts;

  routeBase = slash(routeBase);
  outDir = slashResolve(root, outDir);
  const env = loadEnv(vite.mode, root, "API_");
  Object.entries(env).forEach(([key, value]) => {
    key = key.replace("API_", "");
    process.env[key] = value;
  });

  exclude = [...exclude, "node_modules", ".git"];

  map = {
    default: "use",
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...map,
  };

  const mapper = <Mapper[]>Object.entries(map)
    .filter((it) => it[1])
    .map(([name, method]) => ({
      name,
      method,
    }));

  dirs = dirs.map(({ dir, route }) => {
    dir = slashResolve(root, dir);
    route = assertFileRoute(route);
    return { route, dir };
  });

  return {
    moduleId,
    root,
    entry,
    handler,
    routeBase,
    include,
    exclude,
    outDir,
    preBuild,
    dirs,
    minify,
    mapper,
  };
};
