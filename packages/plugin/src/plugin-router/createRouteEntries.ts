import fg from "fast-glob";
import path from "slash-path";
import { ApiConfig } from "src/model";


export type RouteFiles = {
    dir: string;
    route: string;
    files: string[];
};


export const parseRouteFiles = (apiConfig: ApiConfig): RouteFiles[] => {
    let { dirs, include, exclude } = apiConfig;
    const currentMode = process.env.NODE_ENV;
    return dirs
        .filter((dir) => {
            if (dir.skip === true || dir.skip === currentMode) {
                return false;
            }
            return true;
        })
        .map((it) => {
            it.exclude = it.exclude || [];
            const ignore = [...exclude, ...it.exclude];
            const files = fg.sync(include, {
                ignore,
                onlyDirectories: false,
                dot: true,
                unique: true,
                cwd: it.dir,
            });
            return {
                dir: it.dir,
                route: it.route,
                files
            };
        });
};




export type ImportEntry = {
    varName: string;
    importFile: string;
};
export type RouteEntry = {
    varName: string;
    order: string;
    method: string;
    route: string;
    sourceFile: string;
    importFile: string;
    routeFile: string;
    routeName: string;
    routePriority: string;
};



const createOrderRoute = ({ route, routePriority }: RouteEntry, { paramPriority, filePriority }: ApiConfig) => {
    const parts = route
        .split("/")
        .filter(Boolean);
    if (parts.length === 0) {
        return routePriority;
    }
    const priorities = parts.map((part) => {
        const s = "_" + part;
        if (/:|\[|\$/.test(part)) {
            return paramPriority + s;
        }
        return filePriority + s;
    });
    priorities.push(routePriority);
    return priorities.join("_");
};

export const parseRouteEntry = (routeFiles: RouteFiles[], apiConfig: ApiConfig): RouteEntry[] => {
    const parseLegacyEntry = (base: RouteEntry) => {
        base = { ...base }
        if (base.method === "index") {
            base.route = path.join(base.route, "/");
        } else {
            base.route = path.join(base.route, base.method);
        }
        return apiConfig.mapperList.map(mapper => {
            return {
                ...base,
                method: mapper.method,
                sourceFile: `${base.sourceFile}?fn=${mapper.name}`,
                routeName: mapper.name,
                routePriority: mapper.priority,
            }
        });
    }
    const parseIsolantedEntry = (base: RouteEntry) => {
        base = { ...base }
        const mapper = apiConfig.mapperList.find(it => it.name === base.routeName);
        base.routePriority = mapper?.priority ?? "0";
        base.method = mapper?.method ?? "0";
        return base;
    }
    const parseEntry = apiConfig.mode === "isolated" ? parseIsolantedEntry : parseLegacyEntry;

    return routeFiles
        .flatMap(cfg => {
            return cfg.files.map(routeFile => {
                const extname = path.extname(routeFile);
                const dirname = path.dirname(routeFile);
                const basename = path.basename(routeFile);
                const sourceFile = path.join(cfg.dir, routeFile);
                const importFile = path.relative(apiConfig.cacheDir, sourceFile);
                const method = basename.replace(extname, "");
                const route = path.join("/", cfg.route, dirname);
                return {
                    varName: '',
                    order: '',
                    method,
                    route,
                    sourceFile,
                    importFile,
                    routeFile,
                    routeName: method,
                    routePriority: "0",
                } as RouteEntry;
            });
        })
        .flatMap(parseEntry)
        .map((it) => {
            const order = createOrderRoute(it, apiConfig);
            const route = it.route
                //NextJS
                .replaceAll('[]', '*')
                .replaceAll('[...', '*')
                .replaceAll('[', ':')
                .replaceAll(']', '')
                //Remix
                .replaceAll('$$', '*')
                .replaceAll('$', ':')
            return { ...it, order, route }
        })
        .sort((a, b) => a.order.localeCompare(b.order))
        .map((it, ix) => {
            const varName = "API_" + ix.toString().padStart(3, "0");
            return { ...it, varName }
        });
}

export const createRouteEntries = (apiConfig: ApiConfig) => {
    const routeFiles = parseRouteFiles(apiConfig);
    const routeEntries = parseRouteEntry(routeFiles, apiConfig);
    const keys: Record<string, string> = {};
    routeEntries.forEach((it) => {
        const varName = keys[it.importFile];
        if (varName) {
            it.varName = varName;
        } else {
            keys[it.importFile] = it.varName;
        }
    });
    const importEntries = Object.entries(keys).map<ImportEntry>(([importFile, varName]) => ({ varName, importFile }));
    return { routeEntries, importEntries };
}