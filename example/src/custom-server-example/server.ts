
//@ts-ignore
import * as configure from "@api/configure";
//@ts-ignore
import { handler } from "@api/handler";
//@ts-ignore
import { endpoints } from "@api/routers";
import express from "express";


const server = express();
//@ts-ignore
configure.serverBefore?.(server);
const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
//@ts-ignore
configure.serverAfter?.(server);
server.on("error", (error) => {
  console.error(`Error at http://localhost:${PORT}import.meta.env.BASE`, error);
  //@ts-ignore
  configure.serverError?.(server, error);
});
server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}import.meta.env.BASE`);
  //@ts-ignore
  configure.serverListening?.(server, endpoints);
});
