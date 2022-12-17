import { PluginConfig } from "./config";
import { Router } from "./router";

export const generateCodeRouter = (routers: Router[], config: PluginConfig) => {
  const importFiles = routers
    .map((it, ix) => `import * as r${ix} from "/${it.file}"`)
    .join("\n");

  const httpRouter = routers
    .map((it, ix) =>
      config.httpMapper
        .map(
          (http) =>
            `   ["${http.method}",\t "/${it.route}",\t r${ix}.${http.fn}],`
        )
        .join("\n")
    )
    .join("\n\n");

  return `
${importFiles}

const internal  = [
${httpRouter}
].filter(it => it[2]);

export const routers = internal.map((args) => {
  const [method, route] = args;
  return { method, route };
});

export const routerList = internal.map(([method, route]) => \`\${method?.toUpperCase()} \\t \${route}\`).join("\\n");

export const applyRouters = (applyRouter) => {
  internal.forEach((args) => {
    const [method, route, callback] = args;
    applyRouter(method, route, callback);
  });
};

  `;
};
