import * as configure from "@api/configure";
import { handler } from "@api/handler";
import { endpoints } from "@api/routers";
import express from "express";

const server = express();
configure.serverBefore?.(server);

const {
  HOST = "0.0.0.0",
  PORT = "3000",
  BASE = API_ROUTES.BASE,
  BASE_API = API_ROUTES.BASE_API,
} = process.env;

const SERVER_URL = `http://${HOST}:${PORT}${BASE}`;

server.use(BASE, express.static(API_ROUTES.PUBLIC_DIR));
server.use(BASE_API, handler);

configure.serverAfter?.(server);

const PORT_NRO = parseInt(PORT);
server
  .listen(PORT_NRO, HOST, () => {
    console.log(`Ready at ${SERVER_URL}`);
    configure.serverListening?.(server, endpoints);
  })
  .on("error", (error) => {
    console.error(`Error at ${SERVER_URL}`, error);
    configure.serverError?.(server, error);
  });
