import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeServerFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { cacheDir, serverFile, moduleId } = config;
  if (!serverFile.startsWith(cacheDir)) {
    return false;
  }
  const code = `
import { handler } from "${moduleId}/handler";
import { endpoints } from "${moduleId}/routers";
import * as configure from "${moduleId}/configure";
import express from "express";


const server = express();
configure.serverBefore?.(server);

const { 
  HOST = '0.0.0.0', 
  PORT = 3000, 
  BASE = API_ROUTES.BASE,
  BASE_API = API_ROUTES.BASE_API,
  PUBLIC_DIR = API_ROUTES.PUBLIC_DIR,
} = process.env;

const SERVER_URL = \`http://\${HOST}:\${PORT}\${BASE}\`;

server.use(BASE, express.static(PUBLIC_DIR));
server.use(BASE_API, handler);

configure.serverAfter?.(server);

server.listen(PORT, HOST, (error) => {
  if(error){
    console.error(\`Error at \${SERVER_URL}\`, error);
    configure.serverError?.(server, error);
  } else {
    console.log(\`Ready at \${SERVER_URL}\`);
    configure.serverListening?.(server, endpoints);
  }
});
`;
  fs.writeFileSync(serverFile, code);
};
