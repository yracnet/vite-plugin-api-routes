import fg from "fast-glob";
import path from "slash-path";
import { ApiConfig } from "../model";

type PathString = string | null | undefined;

const byOrder = (a: any, b: any) => {
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return -1;
  }
  return 0;
};

const createFileKey = (route: string, apiConfig: ApiConfig) => {
  const { mode, mapperList } = apiConfig;
  let key = route;
  if (mode === "isolated") {
    mapperList.forEach((m) => {
      key = key.replace(`/${m.name}`, `/${m.priority}`);
    });
  }
  key = key
    .replace(/\//g, "/a_")
    .replace(/\/a_(\$|\[|\:)/g, "/z_$1")
    .replace(/a_index.(.*)$/, "");
  return key;
};

export const createFileRoute = (...names: PathString[]) => {
  const route = names
    .map((name) => name?.replace(/^\//, "").replace(/\/$/, ""))
    //Remix
    .map((name) => name?.replaceAll("$", ":"))
    //NextJS
    .map((name) => name?.replaceAll("[", ":").replaceAll("]", ""))
    //Remove Extension
    .map((name) => name?.replace(/\.[^.]+$/, ""))
    //Remove Index
    .map((name) => name?.replaceAll(/index$/gi, ""))
    .map((name) => name?.replaceAll(/_index$/gi, ""))
    .filter((name) => name)
    .join("/");
  return path.join("/", route);
};

export type FileRouter = {
  name: string;
  file: string;
  path: string;
  route: string;
  order: number;
  key: string;
};

export const getFileRouters = (apiConfig: ApiConfig): FileRouter[] => {
  let { dirs, include, exclude, mode } = apiConfig;
  return dirs.flatMap((it, ix) => {
    it.exclude = it.exclude || [];
    const ignore = [...exclude, ...it.exclude];
    const files: string[] = fg.sync(include, {
      ignore,
      onlyDirectories: false,
      dot: true,
      unique: true,
      cwd: it.dir,
    });
    return files
      .map((file, jx) => {
        const route = createFileRoute(it.route, file);
        const pathName = path.join("/", apiConfig.routeBase, route);
        file = path.join(it.dir, file);
        file = path.relative(apiConfig.root, file);
        const key = createFileKey(pathName, apiConfig);
        return {
          order: jx,
          name: `__DIR_${ix}_FILE_${jx}__`,
          file,
          path: pathName,
          route,
          key,
        };
      })
      .sort((a, b) => {
        return a.key.localeCompare(b.key);
      })
      .map((it, ix) => {
        it.order = ix + 1;
        it.name = `__API_${ix + 1}__`;
        return it;
      });
  });
};

export type MethodRouter = {
  order: number;
  source: string;
  method: string;
  route: string;
  path: string;
  cb: string;
};

export const getMethodRouters = (
  fileRoutes: FileRouter[],
  apiConfig: ApiConfig
): MethodRouter[] => {
  if (apiConfig.mode === "isolated") {
    return fileRoutes
      .map((r) => {
        const m = apiConfig.mapperList.find((m) =>
          r.route.endsWith(`/${m.name}`)
        );
        if (m == null) {
          return null;
        }
        const re = new RegExp(`${m.name}$`);
        return <MethodRouter>{
          order: r.order,
          source: r.file,
          method: m.method,
          path: r.path.replace(re, ""),
          route: r.route.replace(re, ""),
          cb: r.name + ".default",
        };
      })
      .filter((r) => !!r)
      .sort(byOrder);
  }

  return fileRoutes
    .flatMap((r) =>
      apiConfig.mapperList.map((m) => {
        let cb = r.name + "." + m.name;
        let source = r.file + "?fn=" + m.name;
        source = path.relative(apiConfig.root, source);
        return {
          order: r.order,
          source,
          method: m.method,
          path: r.path,
          route: r.route,
          cb,
        };
      })
    )
    .sort(byOrder);
};
