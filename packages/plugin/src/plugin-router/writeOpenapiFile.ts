import fs from "fs";
import path from "path";
import { ResolvedConfig } from "vite";
import YAML from "yaml";
import { ApiConfig } from "../model";
import { getAllFileRouters, parseMethodRouters } from "./common";

const VALID_METHODS = new Set([
  "get", "post", "put", "patch", "delete", "options"
]);

export const writeOpenapiFile = (apiConfig: ApiConfig, vite: ResolvedConfig) => {
  const { openapiFile, mode, cacheDir } = apiConfig;
  if (mode !== "isolated") return;

  const baseDoc = fs.existsSync(openapiFile)
    ? fs.readFileSync(openapiFile, "utf8")
    : `swagger: "2.0"
info:
  title: Simple Open API
  version: 1.0.0
`;

  const doc = YAML.parse(baseDoc);
  doc.paths = {};
  const fileRouters = getAllFileRouters(apiConfig);
  const methodRouters = parseMethodRouters(fileRouters, apiConfig);
  for (const route of methodRouters) {
    const method = route.method?.toLowerCase();
    if (!VALID_METHODS.has(method)) continue;
    const ymlPath = path.join(cacheDir, route.source.replace(path.extname(route.source), ".yml"));
    try {
      const file = fs.readFileSync(ymlPath, "utf8");
      const data = YAML.parse(file);
      doc.paths[route.route] ??= {};
      doc.paths[route.route][method] = data;

    } catch {
      // archivo no existe o error parseando → lo ignoras silenciosamente
      continue;
    }
  }
  fs.writeFileSync(openapiFile, YAML.stringify(doc));
};