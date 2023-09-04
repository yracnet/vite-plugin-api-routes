import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeServerFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { cacheDir, serverFile, moduleId } = config;
  if (serverFile.startsWith(cacheDir)) {
    const code = `
import { handler } from "${moduleId}/handler";
import { endpoints } from "${moduleId}/routers";
import express from "express";

const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;
const server = express();
server.use(express.json());
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
server.listen(PORT, () => {
  console.log(\`Ready at http://localhost:\${PORT}\`);
  console.log(endpoints);
});
`;
    fs.writeFileSync(serverFile, code);
  }
};
