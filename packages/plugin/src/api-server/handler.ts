import express, { Express } from "express";
import * as configure from "vite-plugin-api-routes/configure";

export const handler: Express = express();

configure.handlerBefore?.(handler);
handler.get("/info", (_, res) => {
  res.json("Hellow");
});

configure.handlerAfter?.(handler);
