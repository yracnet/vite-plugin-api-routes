import { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../../common/authMiddleware.js";
import { createResponseAsync } from "../../common/response.js";

export const POST = async (req: Request, res: Response, next: NextFunction) => {
  ["auth", "article", "user"].forEach(name => {
    res.clearCookie(name);
  });
  return createResponseAsync("Logged out!", req, res, next);
};

/* Any amount of middlewares */
/* Like this the user cannot logout if he is not logged in */
export default [
  authMiddleware
]