
import { Express, NextFunction, Request, Response } from "express";

export type RequestCallback = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type AnyExpress = Express & {
    [key: string]: RequestCallback;
}

export type Handler = AnyExpress;

export type Server = AnyExpress;

export type Callback = RequestCallback | RequestCallback[];

export type RouteInfo = {
    source: string;
    method: "get" | "post" | "put" | "push" | "delete" | string;
    route: string;
    path: string;
    url: string;
};

export type RouteModule = RouteInfo & {
    cb: Callback;
};

export type ApplyRouter = (route: RouteModule) => void;

export type ApplyRouters = (apply: ApplyRouter) => void;


export type ViteServerHook = (server: Server, viteServer: any) => void;

export type ServerHook = (server: Server) => void;

export type HandlerHook = (handler: Handler) => void;

export type CallbackHook = (callback: Callback, route: RouteInfo) => Callback;

export type StatusHook = (server: Server, status: any) => void;

