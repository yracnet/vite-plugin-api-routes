import { NextFunction, Request, Response } from "express";

export type ApiFunction<
  Param = any,
  Result = any,
  Payload = any,
  Query = any
> = (
  req: Request<Param, Result, Payload, Query>,
  res: Response<Result>,
  next: NextFunction
) => Promise<void> | void | any | Promise<any>;

export type ApiErrorFunction<
  Param = any,
  Result = any,
  Payload = any,
  Query = any
> = (
  error: any,
  req: Request<Param, Result, Payload, Query>,
  res: Response<Result>,
  next: NextFunction
) => Promise<void> | void;
