import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeHandlerFile = (
  config: PluginConfig,
  vite: ResolvedConfig
) => {
  const { cacheDir, handlerFile, moduleId } = config;
  if (handlerFile.startsWith(cacheDir)) {
    const code = `
import express from "express";
import { applyRouters } from "${moduleId}/routers";

export const handler = express();

applyRouters(
  (props) => {
    const { method, route, path, cb } = props;
    if (handler[method]) {
      handler[method](route, cb);
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);
`;
    fs.writeFileSync(handlerFile, code);
  }
};
