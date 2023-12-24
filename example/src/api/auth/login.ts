import { NextFunction, Request, Response } from "express";
import { createResponseAsync } from "../../common/response";
import { jwtSign } from "../../middleware/jwt";

export const POST = (req: Request, res: Response, next: NextFunction) => {
  const token = jwtSign({
    name: 'Willyams',
    roles: ['ADMIN', 'USER'],
  });
  res.cookie('token', token, { httpOnly: false });
  createResponseAsync("Logged in!", req, res, next);
};
