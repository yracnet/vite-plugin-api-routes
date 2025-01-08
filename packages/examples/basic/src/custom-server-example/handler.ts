import * as configure from "@api/configure";
import { applyRouters } from "@api/routers";
import express from "express";

export const handler: any = express();

configure.handlerBefore?.(handler);

applyRouters((module) => {
  const { method, route, cb } = module;
  if (handler[method]) {
    if (Array.isArray(cb)) {
      handler[method](route, ...cb);
    } else {
      handler[method](route, cb);
    }
  } else {
    console.log("Not Support", method, "for", route, "in", handler);
  }
});

configure.handlerAfter?.(handler);
