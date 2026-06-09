import fs from "fs";
import path from "path";
import { ResolvedConfig } from "vite";
import YAML from "yaml";
import { ApiConfig } from "../model";
import { createRouteEntries } from "./createRouteEntries";

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
  const { routeEntries } = createRouteEntries(apiConfig);
  for (const route of routeEntries) {
    const method = route.method?.toLowerCase();
    if (!VALID_METHODS.has(method)) continue;
    const ymlPath = path.join(cacheDir, route.importFile.replace(path.extname(route.importFile), ".yml"));
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