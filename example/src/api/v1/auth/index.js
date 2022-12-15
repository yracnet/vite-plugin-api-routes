import { createResponse } from "../../response";

export const GET = (req, res, next) => {
  createResponse("v1/auth/index.js", req, res, next);
};
