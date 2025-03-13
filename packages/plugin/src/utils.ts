import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

export const getPluginDirectory = () => {
  if (typeof __dirname === "undefined") {
    const filename = fileURLToPath(import.meta.url);
    return path.dirname(filename);
  } else {
    return __dirname;
  }
};

export const findDirPlugin = (dirname: string, max = 5) => {
  const basedir = getPluginDirectory();
  let relative = "/";
  let dirPath = "";
  for (var i = 0; i < max; i++) {
    dirPath = path.join(basedir, relative, dirname);
    if (fs.existsSync(dirPath)) {
      return dirPath;
    }
    relative += "../";
  }
  throw Error(`Not found: ${dirPath}`);
};

export const cleanDirectory = (target: string) => {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(target, { recursive: true });
};

export const copyFilesDirectory = (
  origin: string,
  target: string,
  {
    files = [],
    oldId = "",
    newId = "",
  }: {
    files: string[];
    oldId: string;
    newId: string;
  }
) => {
  files.forEach((file) => {
    const sourceFilePath = path.join(origin, file);
    const targetFilePath = path.join(target, file);
    if (oldId !== newId) {
      let fileContent = fs.readFileSync(sourceFilePath, "utf-8");
      fileContent = fileContent.replace(new RegExp(oldId, "g"), newId);
      fs.writeFileSync(targetFilePath, fileContent, "utf-8");
    } else {
      fs.copySync(sourceFilePath, targetFilePath, { overwrite: true });
    }
  });
};
