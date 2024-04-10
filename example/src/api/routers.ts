import { routers } from "@api/routers";
import { NextFunction, Request, Response } from "express";

export const GET = (req: Request, res: Response, next: NextFunction) => {
  const routesKeys = routers
    .filter((it) => it.path !== "/api/routers")
    .map((it, ix) => {
      //@ts-ignore
      it.key = `r${ix}`;
      return it;
    })
    .sort((a, b) => {
      if (a.path.startsWith("/api/auth/")) {
        return -1;
      }
      if (b.path.startsWith("/api/auth/")) {
        return 0;
      }
      return 0;
    });
  res.send(routesKeys);
};
