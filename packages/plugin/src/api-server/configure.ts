import { HandleFunction } from "connect";
import express, { ErrorRequestHandler, Express, Handler } from "express";
import { Connect } from "vite";
import { Callback, RouteInfo } from "vite-plugin-api-routes/handler";

export type ViteServerHook = (server: Connect.Server, viteServer: any) => void;

export type ServerHook = (server: Express) => void;

export type HandlerHook = (handler: Handler) => void;

export type CallbackHook = (callback: Callback, route: RouteInfo) => Callback;

export type StatusHook = (server: Express, status: any) => void;

export const viteServerBefore: ViteServerHook = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const viteServerAfter: ViteServerHook = (server) => {
  const errorHandler: HandleFunction = (err, _, res, next) => {
    if (err instanceof Error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};

export const serverBefore: ServerHook = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const serverAfter: ServerHook = (server) => {
  const errorHandler: ErrorRequestHandler = (error, _, res, next) => {
    if (error instanceof Error) {
      res.status(403).json({ error: error.message });
    } else {
      next(error);
    }
  };
  server.use(errorHandler);
};

export const handlerBefore: HandlerHook = () => {};

export const handlerAfter: HandlerHook = () => {};

export const callbackBefore: CallbackHook = (callback) => {
  return callback;
};

export const serverListening: StatusHook = () => {
  console.log(`Server Running`);
};

export const serverError: StatusHook = (_, error) => {
  console.log(`Server Error: `, error);
};
