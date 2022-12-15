import { createResponse } from "../response";

export const PING = (req, res, next) => {
  createResponse("v1/index.js", req, res, next);
};

export default (req, res, next) => {
  req.version = "v1.0";
  req.copyright = "Willyams Yujra <yracnet@gmail.com>";
  next();
};
