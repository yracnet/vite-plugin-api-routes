//@ts-ignore
import { handler } from "@api/handler";
import express from "express";

const { PORT = 3000, CLIENT_DIR = "import.meta.env.CLIENT_DIR" } = process.env;
const server = express();
server.use(express.json());
server.use(express.static(CLIENT_DIR));
server.use(handler);
server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
});
