import { NextFunction, Request, Response } from "express";
import { createResponseAsync } from "../../common/response";

export const POST = async (req: Request, res: Response, next: NextFunction) => {
  ["auth", "article", "user", "token"].forEach((name) => {
    res.clearCookie(name);
  });
  return createResponseAsync("Logged out!", req, res, next);
};
