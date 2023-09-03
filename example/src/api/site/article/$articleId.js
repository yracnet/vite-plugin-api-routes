import { createResponse } from "../../response.js";

export const GET = (req, res, next) => {
  createResponse("ARTICLE", req, res, next);
};
