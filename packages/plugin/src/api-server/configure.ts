import express, { ErrorRequestHandler, Express, Handler } from "express";
import { Callback, RouteInfo } from "vite-plugin-api-routes/handler";

export type ViteServerHook = (server: Express, viteServer: any) => void;

export type ServerHook = (server: Express) => void;

export type HandlerHook = (handler: Handler) => void;

export type CallbackHook = (callback: Callback, route: RouteInfo) => Callback;

export type StatusHook = (server: Express, status: any) => void;

const errorHandler: ErrorRequestHandler = (error, _, res, next) => {
  if (error instanceof Error) {
    res.status(403).json({ error: error.message });
  } else {
    next(error);
  }
};

export const viteServerBefore: ViteServerHook = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const viteServerAfter: ViteServerHook = (server) => {
  server.use(errorHandler);
};

export const serverBefore: ServerHook = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const serverAfter: ServerHook = (server) => {
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
