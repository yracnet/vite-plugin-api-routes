import express from "express";
import dotenv from "dotenv";
import { applyRouters, enpoints } from "virtual:vite-plugin-api:router";

dotenv.config();
const { PORT = 3000, CLIENT_DIR = "import.meta.env.CLIENT_DIR" } = process.env;

const server = express();
server.use(express.json());
server.use(express.static(CLIENT_DIR));
applyRouters((props) => {
  const { action, method, path, cb } = props;
  if (server[method]) {
    server[method](path, cb);
  } else {
    server.post(path, (req, res, next) => {
      if (req.headers["xxx-action"] === action) {
        cb(req, res, next);
      } else {
        next();
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
  console.debug(enpoints);
});
