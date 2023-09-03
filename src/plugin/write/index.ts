import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { writeHandlerFile } from "./handlerFile";
import { writeRoutersFile } from "./routersFile";
import { writeServerFile } from "./serverFile";

export const generateStart = (config: PluginConfig, vite: ResolvedConfig) => {
  fs.mkdirSync(config.cacheDir, { recursive: true });
  writeHandlerFile(config, vite);
  writeServerFile(config, vite);
  generateReload(config, vite);
};

export const generateReload = (config: PluginConfig, vite: ResolvedConfig) => {
  writeRoutersFile(config, vite);
};
