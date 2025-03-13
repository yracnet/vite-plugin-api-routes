// src/server/configure.js
import express from "express";

// DEV MODE
export const viteServerBefore = (server, viteServer) => {
  console.log("VITEJS SERVER");
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

// DEV MODE
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

// PROD MODE
export const serverBefore = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

// PROD MODE
export const serverAfter = (server) => {
  const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};
