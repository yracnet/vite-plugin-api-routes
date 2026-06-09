import fs from "fs";
import { ResolvedConfig } from "vite";
import { ApiConfig } from "../model";
import { createRouteEntries, ImportEntry, RouteEntry } from "./createRouteEntries";

export const writeHandlerFile = (apiConfig: ApiConfig, _vite: ResolvedConfig) => {
  const { moduleId, handlerFile } = apiConfig;
  const { routeEntries, importEntries } = createRouteEntries(apiConfig);
  const log = routeEntries
    .map(it => {
      return `// ${it.varName}|${it.routeName.padEnd(8, ' ')}|${it.method.padEnd(8, ' ')}|${it.route.padEnd(20, ' ')}|${it.order}`
    })
    .join("\n");

  const importLine = (it: ImportEntry) =>
    apiConfig.mode === "legacy"
      ? `import * as ${it.varName} from "./${it.importFile}";`
      : `import ${it.varName} from "./${it.importFile}";`;

  const handlerLine = (it: RouteEntry) =>
    apiConfig.mode === "legacy"
      ? `${it.varName}.${it.routeName} && handler.${it.method}("${it.route}", ${it.varName}.${it.routeName});`
      : `handler.${it.method}("${it.route}", ${it.varName});`;

  const code = `
// Files Imports
import Express from "express";
${importEntries.map(importLine).join("\n")}
import * as configure from "${moduleId}/configure";

${log}

export const handler = Express();
configure.handlerBefore?.(handler);
${routeEntries.map(handlerLine).join("\n")}
configure.handlerAfter?.(handler);
`;
  fs.writeFileSync(handlerFile, code);
};
