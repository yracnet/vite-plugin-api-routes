import express from "express";
import dotenv from "dotenv";
import { handler } from "virtual:vite-plugin-api:handler";
dotenv.config();

const { PORT = 3000, CLIENT_DIR = "import.meta.env.CLIENT_DIR" } = process.env;

const server = express();
server.use(express.json());
server.use(express.static(CLIENT_DIR));
server.use(handler);

server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
});
