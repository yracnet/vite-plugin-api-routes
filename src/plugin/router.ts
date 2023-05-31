import fg from "fast-glob";
import { PluginConfig } from "./config";
import { slashJoin, slashRelative } from "./util";

type Path = string | null | undefined;

export const assertFileRoute = (...paths: Path[]) => {
  return (
    paths
      .map((path) => path?.replace(/^\//, "").replace(/\/$/, ""))
      //Remix
      .map((path) => path?.replaceAll("$", ":"))
      //NextJS
      .map((path) => path?.replaceAll("[", ":").replaceAll("]", ""))
      .map((path) => path?.replace(/\.[^.]+$/, ""))
      .map((path) => path?.replaceAll(/index$/gi, ""))
      .filter((it) => it)
      .join("/")
  );
};

export type FileRouter = {
  name: string;
  file: string;
  path: string;
  route: string;
};

export const getFileRouters = (config: PluginConfig): FileRouter[] => {
  let { dirs, include, exclude } = config;
  return dirs.flatMap((it, ix) =>
    fg
      .sync(include, {
        ignore: exclude,
        onlyDirectories: false,
        dot: true,
        unique: true,
        cwd: it.dir,
      })
      .sort()
      .map((file, jx) => {
        let route = assertFileRoute(it.route, file);
        let path = `/${config.routeBase}/${route}`;
        route = `/${route}`;
        file = slashJoin(it.dir, file);
        return {
          name: `_${ix}_${jx}`,
          file,
          path,
          route,
        };
      })
  );
};

export type MethodRouter = {
  source: string;
  method: string;
  path: string;
  route: string;
  cb: string;
};

export const getMethodRouters = (config: PluginConfig): MethodRouter[] => {
  return getFileRouters(config).flatMap((r) =>
    config.mapper.map((m) => {
      let cb = r.name + "." + m.name;
      let source = r.file + "?fn=" + m.name;
      source = slashRelative(config.root, source);

      return {
        source,
        method: m.method,
        path: r.path,
        route: r.route,
        cb,
      };
    })
  );
};
