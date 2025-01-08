import express, { ErrorRequestHandler, Express, RequestHandler } from "express";
import * as configure from "vite-plugin-api-routes/configure";
import { applyRouters } from "vite-plugin-api-routes/routers";

export type Callback =
  | ErrorRequestHandler
  | RequestHandler
  | (ErrorRequestHandler | RequestHandler)[];

export type RouteInfo = {
  source: string;
  method: "get" | "post" | "put" | "push" | "delete" | string;
  route: string;
  path: string;
  url: string;
};

export type RouteModule = RouteInfo & {
  cb: Callback;
};

export const handler: Express = express();

configure.handlerBefore?.(handler);

applyRouters((props: RouteModule) => {
  const { method, route, path, cb } = props;
  //@ts-ignore
  if (handler[method]) {
    if (Array.isArray(cb)) {
      //@ts-ignore
      handler[method](route, ...cb);
    } else {
      //@ts-ignore
      handler[method](route, cb);
    }
  } else {
    console.log("Not Support", method, "for", route, "in", handler);
  }
});

configure.handlerAfter?.(handler);
