import { loadEnv } from "dotenv-local";
import express from "express";
import * as configure from "vite-plugin-api-routes/configure";
import { handler } from "vite-plugin-api-routes/handler";
import { endpoints } from "vite-plugin-api-routes/routers";

const server = express();
configure.serverBefore?.(server);

const { HOST, PORT } = loadEnv({
  envPrefix: "SERVER_",
  removeEnvPrefix: true,
  envInitial: {
    SERVER_HOST: "127.0.0.1",
    SERVER_PORT: "3000",
  },
});

const SERVER_URL = `http://${HOST}:${PORT}${API_ROUTES.BASE}`;

server.use(API_ROUTES.BASE_API, handler);
server.use(API_ROUTES.BASE, express.static(API_ROUTES.PUBLIC_DIR));

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
