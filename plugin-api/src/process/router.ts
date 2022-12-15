import fg from "fast-glob";
import { PluginConfig } from "./config";
import { slashJoin } from "./util";

type Path = string | null | undefined;

export const assertRoutePath = (...paths: Path[]) => {
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

export type Router = {
  file: string;
  route: string;
};

export const createRouters = (config: PluginConfig): Router[] => {
  let { root, routes, include, exclude } = config;
  return routes.flatMap((parent) => {
    return fg
      .sync(include, {
        ignore: exclude,
        onlyDirectories: false,
        dot: true,
        unique: true,
        cwd: slashJoin(root, parent.file),
      })
      .map((file) => {
        let route = assertRoutePath(parent.route, file);
        file = slashJoin(root, parent.file, file);
        return {
          file,
          route,
        };
      })
      .sort((a, b) => {
        if (a.route > b.route) {
          return 1;
        }
        if (a.route < b.route) {
          return -1;
        }
        return 0;
      });
  });
};
