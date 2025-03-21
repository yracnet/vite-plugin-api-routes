import fg from "fast-glob";
import path from "slash-path";
import { ApiConfig } from "../model";

type Key = { key: string };
const byKey = (a: Key, b: Key) => a.key.localeCompare(b.key);

const isParam = (name: string) => /:|\[|\$/.test(name);

export const createKeyRoute = (route: string, apiConfig: ApiConfig) => {
  return route
    .split("/")
    .filter((it) => it)
    .map((n) => {
      //const s = "_" + n.padEnd(6, "_");
      const s = "_" + n;
      const p = apiConfig.mapperList.find((r) => r.name === n);
      if (p) {
        return p.priority + s;
      } else if (isParam(n)) {
        return apiConfig.paramPriority + s;
      }
      return apiConfig.filePriority + s;
    })
    .join("_");
};

export const parseFileToRoute = (names: string) => {
  const route = names
    .split("/")
    .map((name) => {
      name = name
        // Param Remix
        .replaceAll("$", ":")
        // Param NextJS
        .replaceAll("[", ":")
        .replaceAll("]", "");
      return name;
    })
    .join("/");
  return (
    route
      // Remove Extension
      .replace(/\.[^.]+$/, "")
      // Remove Index
      .replaceAll(/index$/gi, "")
      // Remove Index
      .replaceAll(/_index$/gi, "")
  );
};

export type FileRouter = {
  varName: string;
  name: string;
  file: string;
  route: string;
  key: string;
};

export const getAllFileRouters = (apiConfig: ApiConfig): FileRouter[] => {
  let { dirs, include, exclude } = apiConfig;
  const currentMode = process.env.NODE_ENV;
  return dirs
    .filter((dir) => {
      if (dir.skip === true || dir.skip === currentMode) {
        return false;
      }
      return true;
    })
    .flatMap((it) => {
      it.exclude = it.exclude || [];
      const ignore = [...exclude, ...it.exclude];
      const files: string[] = fg.sync(include, {
        ignore,
        onlyDirectories: false,
        dot: true,
        unique: true,
        cwd: it.dir,
      });
      return files.map((file) => {
        const routeFile = path.join("/", it.route, file);
        const route = parseFileToRoute(routeFile);
        const key = createKeyRoute(route, apiConfig);
        const relativeFile = path.relative(
          apiConfig.root,
          path.join(it.dir, file)
        );
        return {
          name: path.basename(routeFile),
          file: relativeFile,
          route,
          key,
        };
      });
    })
    .map((it) => ({
      varName: "API_",
      name: it.name,
      file: it.file,
      route: it.route,
      key: it.key,
    }))
    .sort(byKey)
    .map((it, ix) => {
      it.varName = "API_" + ix.toString().padStart(3, "0");
      return it;
    });
};

export type MethodRouter = {
  key: string;
  source: string;
  method: string;
  route: string;
  url: string;
  cb: string;
};

export const parseMethodRouters = (
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
        const route = r.route.replace(re, "");
        return {
          key: r.key,
          source: r.file,
          method: m.method,
          route,
          url: path.join("/", apiConfig.routeBase, route),
          cb: r.varName + ".default",
        };
      })
      .filter((r) => !!r);
  }

  return fileRoutes
    .flatMap((it) => {
      return apiConfig.mapperList.map((m) => {
        const route = path.join(it.route, m.name);
        const key = createKeyRoute(route, apiConfig);
        return {
          ...it,
          key,
          name: m.name,
          method: m.method,
        };
      });
    })
    .sort(byKey)
    .map((it) => {
      let cb = it.varName + "." + it.name;
      const source = it.file + "?fn=" + it.name;
      const route = it.route;
      return {
        key: it.key,
        source,
        method: it.method,
        route,
        url: path.join("/", apiConfig.routeBase, route),
        cb,
      };
    });
};
