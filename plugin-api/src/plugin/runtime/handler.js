import express from "express";
import polka from "polka";

// import {}
import { applyServer } from "./apply-server";

export const handler = express();

export const applyDevServer = async (devServer, config) => {
  devServer.middlewares.use(async (req, res, next) => {
    try {
      const mod = await devServer.ssrLoadModule(`/@id/${config.id}`);
      handler.get("/@vite-plugin-api/routers", (req, res, next) => {
        res.send(mod.routers);
      });
      applyServer(handler, mod.applyRouters);
      const server = polka({
        onNoMatch: () => next(),
      });
      server.use(handler);
      server.handler(req, res);
    } catch (error) {
      devServer.ssrFixStacktrace(error);
      process.exitCode = 1;
      next(error);
    }
  });
};
