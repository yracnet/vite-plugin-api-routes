import { createResponse } from "../../response";

export const GET = (req, res, next) => {
  createResponse("v1/auth/status.js", req, res, next);
};
