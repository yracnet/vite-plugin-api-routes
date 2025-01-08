import * as configure from "vite-plugin-api-routes/configure";
import { RouteInfo, RouteModule } from "vite-plugin-api-routes/handler";

export type ApplyRouter = (route: RouteModule) => void;

export type ApplyRouters = (apply: ApplyRouter) => void;

export const routeBase: string = "/api";

const internal: RouteModule[] = [];

export const routers: RouteInfo[] = [];

export const endpoints: string[] = [];

export const applyRouters: ApplyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};
