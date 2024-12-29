import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { writeConfigureFile } from "./configureFile";
import { writeHandlerFile } from "./handlerFile";
import { writeRoutersFile } from "./routersFile";
import { writeServerFile } from "./serverFile";
import { writeTypesFile } from "./typesFile";

export const generateStart = (config: PluginConfig, vite: ResolvedConfig) => {
  fs.mkdirSync(config.cacheDir, { recursive: true });
  writeConfigureFile(config, vite);
  writeHandlerFile(config, vite);
  writeServerFile(config, vite);
  writeTypesFile(config, vite);
  generateReload(config, vite);
};

export const generateReload = (config: PluginConfig, vite: ResolvedConfig) => {
  writeRoutersFile(config, vite);
};
