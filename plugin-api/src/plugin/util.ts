import path from "path";
import fs from "fs";

export const slash = (str = "") => {
  return str.replace(/\\/g, "/");
};

export const slashJoin = (...paths: string[]) => {
  return slash(path.join(...paths));
};

export const slashRelative = (from: string, to: string) => {
  return slash(path.relative(from, to));
};

export const slashResolve = (...paths: string[]) => {
  return slash(path.resolve(...paths));
};

export const slashResolveIfExist = (
  root: string,
  file?: string
): string | undefined => {
  if (file) {
    file = slashResolve(root, file);
    if (!fs.existsSync(file)) {
      console.warn(`The app: ${file} not exist!`);
      file = undefined;
    }
  }
  return file;
};

export const getSourceCode = (file: string): string =>
  fs.readFileSync(file, { encoding: "utf8" });
