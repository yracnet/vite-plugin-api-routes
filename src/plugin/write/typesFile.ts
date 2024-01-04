import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeTypesFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { moduleId, typesFile } = config;
  const code = `
declare module "${moduleId}/handler" {
    import { ServerHandler } from "vite-plugin-api-routes/model";
    export const handler: ServerHandler;
}

declare module "${moduleId}/routers" {
    import { ApplyRouters, RouteInfo } from "vite-plugin-api-routes/model";
    export const routeBase: string;
    export const routers: RouteInfo[];
    export const endpoints: string[];
    export const applyRouters: ApplyRouters;
}

declare module "${moduleId}/configure" {
    export { 
      ViteServerHook,
      ServerHook,
      HandlerHook,
      CallbackHook,
      StatusHook,
    } from "vite-plugin-api-routes/model";
}    
`;
  fs.writeFileSync(typesFile, code);
};
