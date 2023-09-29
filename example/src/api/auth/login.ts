import { NextFunction, Request, Response } from "express";
import { createResponseAsync } from "../../common/response.js";

export const POST = async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("auth", true);
  return createResponseAsync("Logged in!", req, res, next);
};
