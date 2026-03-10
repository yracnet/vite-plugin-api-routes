import express, { ErrorRequestHandler } from "express";
import { HandlerHook, ServerHook, StatusHook, ViteServerHook } from "./configure";

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

export const handlerBefore: HandlerHook = () => { };

export const handlerAfter: HandlerHook = () => { };

export const serverListening: StatusHook = (_, status) => {
  console.log(`Server Running:`, status);
};

export const serverError: StatusHook = (_, error) => {
  console.log(`Server Error: `, error);
};
