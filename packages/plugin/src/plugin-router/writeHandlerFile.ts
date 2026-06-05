import fs from "fs";
import { ResolvedConfig } from "vite";
import { ApiConfig } from "../model";
import { getAllFileRouters, parseMethodRouters } from "./common";

const printList = <T>(list: T[], fn: (a: T, ix: number) => string, end: string = '\n') => {
  return list.map((it, ix) => fn(it, ix)).join(end);
}

export const writeHandlerFile = (apiConfig: ApiConfig, vite: ResolvedConfig) => {
  const { moduleId, handlerFile } = apiConfig;
  const fileRouters = getAllFileRouters(apiConfig);
  const methodRouters = parseMethodRouters(fileRouters, apiConfig);
  // const endpoints = methodRouters.map((it) => `${it.method.toUpperCase().padEnd(6, ' ')} ${it.url}`)
  // export const services = ${JSON.stringify(endpoints, null, 2)};
  const code = `
// Files Imports
import Express from "express";
${printList(fileRouters, (it) => `import ${it.varName} from "./${it.file}";`)}
import * as configure from "${moduleId}/configure";

export const handler = Express();
configure.handlerBefore?.(handler);
${printList(methodRouters, (it) => `handler.${it.method}("${it.route}", ${it.cb});`)}
configure.handlerAfter?.(handler);
`;
  fs.writeFileSync(handlerFile, code);

};
