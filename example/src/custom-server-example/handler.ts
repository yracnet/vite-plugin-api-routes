//@ts-ignore
import * as configure from "@api/configure";
//@ts-ignore
import { applyRouters } from "@api/routers";
import express from "express";

export const handler: any = express();

//@ts-ignore
configure.handlerBefore?.(handler);

applyRouters(
  (props: any) => {
    const { method, route, cb } = props;
    if (handler[method]) {
      if (Array.isArray(cb)) {
        handler[method](route, ...cb);
      } else {
        handler[method](route, cb);
      }
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);

//@ts-ignore
configure.handlerAfter?.(handler);

