import path from "path";

export const slash = (str = "") => {
  return str.replace(/\\/g, "/");
};

export const slashJoin = (...str: string[]) => {
  return slash(path.join(...str));
};

export const slashRelative = (a: string, b: string) => {
  return slash(path.relative(a, b));
};

export const slashResolve = (a: string, b: string) => {
  return slash(path.resolve(a, b));
};
