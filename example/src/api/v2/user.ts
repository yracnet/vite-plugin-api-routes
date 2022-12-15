//@ts-ignore
import { createResponse } from "../response";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/auth.ts", req, res, next);
};
//@ts-ignore
export const DELETE = (req, res, next) => {
  createResponse("v2/auth.ts", req, res, next);
};
//@ts-ignore
export const PUT = (req, res, next) => {
  createResponse("v2/auth.ts", req, res, next);
};

//@ts-ignore
export default (req, res, next) => {
  res.copyright = "HOC FOR AUTH REQUEST - TS";
  next();
};
