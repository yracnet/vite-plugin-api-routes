import { InlineConfig } from "vite";

export type DirRoute = {
  dir: string;
  route: string;
  exclude?: string[];
};

export type Mapper = {
  name: string;
  method: string;
};

export type PluginConfig = {
  moduleId: string;
  server: string;
  handler: string;
  serverFile: string;
  handlerFile: string;
  routersFile: string;
  dirs: DirRoute[];
  include: string[];
  exclude: string[];
  mapper: { [k: string]: string | false };
  mapperList: Mapper[];
  watcherList: string[];
  routeBase: string;
  root: string;
  cacheDir: string;
  outDir: string;
  minify: boolean;
  preBuild: (config: InlineConfig) => InlineConfig;
};

export type UserConfig = Partial<
  Omit<
    PluginConfig,
    | "serverFile"
    | "handlerFile"
    | "configFile"
    | "routersFile"
    | "mapperList"
    | "watcherList"
    | "config"
    | "routers"
  >
>;
