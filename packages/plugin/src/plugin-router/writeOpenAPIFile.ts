import fs from "fs";
import { ResolvedConfig } from "vite";
import { ApiConfig } from "../model";
import { getAllFileRouters, parseMethodRouters } from "./common";

export const writeHandlerFile = (apiConfig: ApiConfig, vite: ResolvedConfig) => {
  const { moduleId, handlerFile } = apiConfig;
  const fileRouters = getAllFileRouters(apiConfig);
  const methodRouters = parseMethodRouters(fileRouters, apiConfig);
  // console.log(methodRouters);
  const importFiles = fileRouters
    .map((it) => `import ${it.varName} from "./${it.file}";`)
    .join("\n");
  const handlerRouter = methodRouters
    .map((c) => `handler.${c.method}("${c.route}", ${c.cb});`)
    .join("\n");
  const code = `
// Files Imports
import Express from "express";
${importFiles}
import * as c from "${moduleId}/configure";

export const handler = Express();
c.handlerBefore?.(handler);
${handlerRouter}
c.handlerAfter?.(handler);
`;
  fs.writeFileSync(handlerFile, code);

};
