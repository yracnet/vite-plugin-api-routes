import { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Example authentication, please never it like this.
  if (req.headers['cookie']?.includes("auth=true")) {
    // User is authenticated
    return next();
  } else {
    // User authentication failed, provide some details
    res.status(403).json({
      message: "Invalid Login",
      cookies: req.headers['cookie'] ?? null /* For debug purposes */,
      _info: "Use the '/login' route first to get through protected routes"
    })
  }
}