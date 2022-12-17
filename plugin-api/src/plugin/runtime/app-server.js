import express from "express";
import dotenv from "dotenv";
import { applyRouters, routerList } from "virtual:api-router:router";
import { applyServer } from "./apply-server";

dotenv.config();
const { PORT = 3000, CLIENT_DIR = "process.env.CLIENT_DIR" } = process.env;

const server = express();
server.use(express.json());
server.use(express.static(CLIENT_DIR));

applyServer(server, applyRouters);

server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
  console.debug(routerList);
});
