import { createResponse } from "../response.js";

export const GET = (req, res, next) => {
  createResponse("PING EXAMPLE", req, res, next);
};
