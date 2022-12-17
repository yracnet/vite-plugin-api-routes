import express from "express";
import polka from "polka";
import { applyServer } from "./apply-server";

export const applyDevServer = async (devServer, config) => {
  devServer.middlewares.use(async (req, res, next) => {
    try {
      const mod = await devServer.ssrLoadModule(`/@id/${config.moduleId}`);
      const apiServer = express();
      apiServer.get("/@vite-plugin-api", (req, res, next) => {
        res.send(mod.routers);
      });
      applyServer(apiServer, mod.applyRouters);
      const server = polka({
        onNoMatch: () => next(),
      });
      server.use(apiServer);
      server.handler(req, res);
    } catch (error) {
      devServer.ssrFixStacktrace(error);
      process.exitCode = 1;
      next(error);
    }
  });
};
