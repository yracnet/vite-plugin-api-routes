import fg from "fast-glob";
import path from "slash-path";
import { PluginConfig } from "../types";

type PathString = string | null | undefined;

export const assertFileRoute = (...names: PathString[]) => {
  return (
    names
      .map((name) => name?.replace(/^\//, "").replace(/\/$/, ""))
      //Remix
      .map((name) => name?.replaceAll("$", ":"))
      //NextJS
      .map((name) => name?.replaceAll("[", ":").replaceAll("]", ""))
      .map((name) => name?.replace(/\.[^.]+$/, ""))
      .map((name) => name?.replaceAll(/index$/gi, ""))
      .map((name) => name?.replaceAll(/_index$/gi, ""))
      .filter((name) => name)
      .join("/")
  );
};

export type FileRouter = {
  name: string;
  file: string;
  path: string;
  route: string;
  order: number;
};

export const getFileRouters = (config: PluginConfig): FileRouter[] => {
  let { dirs, include, exclude } = config;
  return dirs.flatMap((it, ix) => {
    it.exclude = it.exclude || [];
    const ignore = [...exclude, ...it.exclude];
    return fg
      .sync(include, {
        ignore,
        onlyDirectories: false,
        dot: true,
        unique: true,
        cwd: it.dir,
      })
      .map((file, jx) => {
        let route = assertFileRoute(it.route, file);
        route = path.join("/", route);
        const pathName = path.join("/", config.routeBase, route);
        file = path.join(it.dir, file);
        const order = route.length * 1000 + route.split(":").length;
        return {
          name: `_${ix}_${jx}`,
          file,
          path: pathName,
          route,
          order,
        };
      })
      .sort((a, b) => {
        return a.order - b.order;
      });
  });
};

export type MethodRouter = {
  source: string;
  method: string;
  route: string;
  path: string;
  cb: string;
  middlewares: string;
};

export const getMethodRouters = (config: PluginConfig): MethodRouter[] => {
  return getFileRouters(config).flatMap((r) =>
    config.mapperList.map((m) => {
      let cb = r.name + "." + m.name;
      let source = r.file + "?fn=" + m.name;
      source = path.relative(config.root, source);

      return {
        source,
        method: m.method,
        path: r.path,
        route: r.route,
        cb,
        middlewares: r.name + ".MIDDLEWARES"
      };
    })
  );
};
