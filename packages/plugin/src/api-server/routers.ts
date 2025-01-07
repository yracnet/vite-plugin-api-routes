import * as configure from "@api/configure";
import { RouteInfo, RouteModule } from "@api/handler";

export type ApplyRouter = (route: RouteModule) => void;

export type ApplyRouters = (apply: ApplyRouter) => void;

export const routeBase: string = "/api";

const internal: RouteModule[] = [];

export const routers: RouteInfo[] = internal.map((it) => {
  const { method, path, route, url, source } = it;
  return { method, url, path, route, source };
});

export const endpoints: string[] = internal.map(
  (it) => it.method?.toUpperCase() + "\t" + it.url
);

export const applyRouters: ApplyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};
