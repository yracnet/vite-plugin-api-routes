import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeHandlerFile = (
  config: PluginConfig,
  vite: ResolvedConfig
) => {
  const { cacheDir, handlerFile, moduleId } = config;
  if (!handlerFile.startsWith(cacheDir)) {
    return false;
  }
  const code = `
import express from "express";
import { applyRouters } from "${moduleId}/routers";
import * as configure from "${moduleId}/configure";

export const handler = express();

configure.handlerBefore?.(handler);

applyRouters(
  (props) => {
    const { method, route, path, cb } = props;
    if (handler[method]) {
      if(Array.isArray(cb)) {
        handler[method](route, ...cb);
      } else {
        handler[method](route, cb);
      }
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);

configure.handlerAfter?.(handler);

`;
  fs.writeFileSync(handlerFile, code);
};
