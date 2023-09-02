import fg from "fast-glob";
import slash from "slash-path";
import { PluginConfig } from "./config";

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
      .sort()
      .map((file, jx) => {
        let route = assertFileRoute(it.route, file);
        let path = `/${config.routeBase}/${route}`;
        route = `/${route}`;
        file = slash.join(it.dir, file);
        return {
          name: `_${ix}_${jx}`,
          file,
          path,
          route,
        };
      });
  });
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
      source = slash.relative(config.root, source);

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
