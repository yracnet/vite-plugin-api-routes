import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeConfigureFile = (
  config: PluginConfig,
  vite: ResolvedConfig
) => {
  const { configureFile, cacheDir } = config;
  if (!configureFile.startsWith(cacheDir)) {
    return false;
  }
  const code = `
import express from "express";

// ViteServerHook
// @WARNING: Please don't include the VITE TYPES here, because it has a problem when you build the project
export const viteServerBefore = (server, viteServer) => {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
};

// @WARNING: Please don't include the VITE TYPES here, because it has a problem when you build the project
export const viteServerAfter = (server, viteServer) => {
    const errorHandler = (err, req, res, next) => {
      if (err instanceof Error) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
      } else {
          next(err);
      }
    };
    server.use(errorHandler);
};

// ServerHook
export const serverBefore = (server) => {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
};

export const serverAfter = (server) => {
    server.use((error, req, res, next) => {
        if (error instanceof Error) {
            return res.status(403).json({ error: error.message });
        }
        next(error);
    });
};

// HandlerHook
export const handlerBefore = (handler) => {
};

export const handlerAfter = (server) => {
};

// CallbackHook
export const callbackBefore = (callback, route) => {
    return callback;
};

// StatusHook
export const serverListening = (server) => {

};

export const serverError = (server, error) => {

};
`;
  fs.writeFileSync(configureFile, code);
};
