import { createResponse } from "../../../common/response.js";

export const GET = (req, res, next) => {
  res.cookie("article", "UPDATE-ARTICLE");
  createResponse("ARTICLE", req, res, next);
};
export const DELETE = (req, res, next) => {
  res.clearCookie("article");
  createResponse("ARTICLE", req, res, next);
};
