import express from "express";
import dotenv from "dotenv";
import { applyRouters, endpoints } from "virtual:vite-plugin-api:router";

dotenv.config();
const { PORT = 3000, CLIENT_DIR = "import.meta.env.CLIENT_DIR" } = process.env;

const server: any = express();
server.use(express.json());
server.use(express.static(CLIENT_DIR));
applyRouters((props) => {
  const { method, path, cb } = props;
  if (server[method]) {
    server[method](path, cb);
  } else {
    console.log("Not Support", method, "in", server);
  }
});

server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
  console.debug(endpoints);
});
