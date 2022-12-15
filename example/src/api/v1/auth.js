import { createResponse } from "../response";

export const DELETE = (req, res, next) => {
  createResponse("v1/auth.js", req, res, next);
};

export const PUT = (req, res, next) => {
  createResponse("v1/auth.js", req, res, next);
};

export default (req, res, next) => {
  res.copyright = "HOC FOR AUTH REQUEST";
  next();
};
