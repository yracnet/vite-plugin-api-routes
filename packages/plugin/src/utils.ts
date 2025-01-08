import fs from "fs-extra";
import path from "slash-path";
import { fileURLToPath } from "url";
import { InlineConfig } from "vite";
import { Mapper, PluginConfig, UserConfig } from "./model";

export const assertConfig = (opts: UserConfig): PluginConfig => {
  let {
    moduleId = "@api",
    cacheDir = ".api",
    root = process.cwd(),
    server = path.join(cacheDir, "server.js"),
    handler = path.join(cacheDir, "handler.js"),
    configure = path.join(cacheDir, "configure.js"),
    routeBase = "api",
    dirs = [{ dir: "src/api", route: "", exclude: [] }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    mapper = {},
    disableBuild = true,
    clientOutDir = "dist/client",
    clientMinify = true,
    clientBuild = (config: InlineConfig) => config,
    serverOutDir = "dist",
    serverMinify = false,
    serverBuild = (config: InlineConfig) => config,
  } = opts;

  root = path.slash(root);
  dirs = dirs.map((it) => {
    it.dir = path.join(root, it.dir);
    return it;
  });

  mapper = {
    default: "use",
    GET: "get",
    PUT: "put",
    POST: "post",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...mapper,
  };
  routeBase = path.join("/", routeBase);
  clientOutDir = path.join(root, clientOutDir);
  serverOutDir = path.join(root, serverOutDir);
  cacheDir = path.join(root, cacheDir);
  const serverFile = path.join(root, server);
  const handlerFile = path.join(root, handler);
  const routersFile = path.join(cacheDir, "routers.js");
  const typesFile = path.join(cacheDir, "types.d.ts");
  const configureFile = path.join(root, configure);

  const mapperList = Object.entries(mapper)
    .filter((it) => it[1])
    .map(([name, method]) => {
      return <Mapper>{
        name,
        method,
      };
    });
  const watcherList = dirs.map((it) => it.dir);
  watcherList.push(cacheDir);
  watcherList.push(serverFile);
  watcherList.push(handlerFile);

  return {
    moduleId,
    server,
    handler,
    configure,
    root,
    serverFile,
    handlerFile,
    routersFile,
    typesFile,
    configureFile,
    routeBase,
    dirs,
    include,
    exclude,
    mapper,
    mapperList,
    watcherList,
    cacheDir,
    disableBuild,
    clientOutDir,
    clientMinify,
    clientBuild,
    serverOutDir,
    serverMinify,
    serverBuild,
  };
};

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
