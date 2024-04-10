import { NextFunction, Request, Response } from "express";

export const createResponse = (
  message: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send({
    source: "sync",
    version: req.version,
    copyright: req.copyright,
    message,
    method: req.method,
    path: req.path,
    params: req.params,
  });
};

export const createResponseAsync = async (
  message: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.send({
    source: "async",
    version: req.version,
    copyright: req.copyright,
    message,
    method: req.method,
    path: req.path,
    params: req.params,
  });
};
