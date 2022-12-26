/**
 * Attach the VIRTUAL definition
 */

declare module "virtual:vite-plugin-api:router" {
  type Callback = () => any;
  type HOC = (cb: Callback) => Callback;
  type Router<T = string> = {
    /**
     * HTTP Method
     */
    method: string;
    /**
     * Full Route
     */
    path: string;
    /**
     * Partial Route
     */
    route: string;
    /**
     * Source Reference Code
     */
    source: string;
    /**
     * Function to Callback is the export function from source code by http method (by mapper config)
     */
    cb: T;
  };
  type ApplyRouter = (router: Router<Callback>) => void;
  export const applyRouters: (
    /**
     * Register Function
     */
    applyRouter: ApplyRouter,
    /**
     * HOC for Callback
     */
    hoc?: HOC
  ) => void;
  /**
   * Route Base for all route
   */
  export const routeBase: string;
  /**
   * All Routers
   */
  export const routers: Router<string>[];
  /**
   * All Endpoint
   */
  export const endpoints: string[];
}

declare module "virtual:vite-plugin-api:config" {
  type Config = {
    config: PluginConfig;
    ruters: FileRouter[];
  };
  export const config: Config;
}
