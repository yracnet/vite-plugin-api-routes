import { ErrorHandleFunction } from "connect";
import express, { ErrorRequestHandler } from "express";
import {
  CallbackHook,
  ServerHook,
  ViteServerHook,
} from "vite-plugin-api-routes/model";
//@ts-ignore
import cookieParser from "cookie-parser";

// ViteServerHook
export const viteServerBefore: ViteServerHook = (server, viteServer) => {
  console.log("VITEJS SERVER");
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
};

export const viteServerAfter: ViteServerHook = (server, viteServer) => {
  const errorHandler: ErrorHandleFunction = (err, req, res, next) => {
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
export const serverBefore: ServerHook = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
};

export const serverAfter: ServerHook = (server) => {
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};

// // HandlerHook
// export const handlerBefore = (handler) => {
//     handler.use(express.json());
//     handler.use(express.urlencoded({ extended: true }));
// };
// export const handlerAfter = (server) => {
// };

// CallbackHook
export const callbackBefore: CallbackHook = (callback, route) => {
  // const { path } = route;
  // const { allowRoles } = callback;
  // if (allowRoles) {
  //     const allowRolesFilter = createAllowRoles(allowRoles);
  //     return [allowRolesFilter, callback];
  // }
  return callback;
};

// // StatusHook
// export const serverListening = (server) => {
// };
// export const serverError = (server, error) => {
// };
