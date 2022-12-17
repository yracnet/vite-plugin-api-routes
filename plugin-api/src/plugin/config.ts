import { APIOptions } from "./main";
import fs from "fs";
import { assertRoutePath } from "./router";
import { slash, slashJoin, slashResolve } from "./util";
import { InlineConfig, ResolvedConfig } from "vite";
export const API_ROUTER = "virtual:api-router";

export type RouterElement = {
  route: string;
  file: string;
};

export type HttpMapper = {
  method: string;
  fn: string;
};

export type PluginConfig = {
  root: string;
  baseRoute: string;
  entry: string;
  include: string[];
  exclude: string[];
  routes: RouterElement[];
  httpMapper: HttpMapper[];
  moduleId: string;
  outDir: string;
  preBuild: (config: InlineConfig) => InlineConfig;
};

const entryDefault = () => {
  return slashJoin(__dirname, "runtime/app-server.js");
};

export const assertPluginConfig = (
  opts: APIOptions,
  vite: ResolvedConfig
): PluginConfig => {
  let {
    entry,
    dirs = [{ dir: "src/api", route: "" }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    fnVerbs = {},
    baseRoute = "api",
    moduleId = API_ROUTER,
    outDir = "dist/server",
    preBuild = (v: InlineConfig) => v,
  } = opts;

  baseRoute = slash(baseRoute);
  const root = slash(vite.root);
  outDir = slashResolve(root, outDir);
  if (entry) {
    let file = slashResolve(root, entry);
    if (!fs.existsSync(file)) {
      vite.logger.warn(`The app: ${entry} not exist! we use the default entry`);
      entry = entryDefault();
    } else {
      entry = file;
    }
  } else {
    entry = entryDefault();
  }

  exclude = [...exclude, "node_modules", ".git"];

  fnVerbs = {
    default: "use",
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...fnVerbs,
  };

  const httpMapper: HttpMapper[] = Object.entries(fnVerbs).map((it) => ({
    fn: it[0],
    method: it[1],
  }));

  const routes: RouterElement[] = dirs.map(({ dir: file, route }) => {
    file = slashResolve(root, file);
    file = file.replace(root, ".");
    route = assertRoutePath(baseRoute, route);
    return { route, file };
  });

  return {
    root,
    entry,
    baseRoute,
    routes,
    include,
    exclude,
    httpMapper,
    moduleId,
    outDir,
    preBuild,
  };
};
