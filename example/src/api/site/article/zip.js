import { createResponse } from "../../../common/response.js";
const order = 0;
export const GET = (req, res, next) => {
  res.cookie("article", "ZIP-ARTICLE");
  createResponse("ZIP ARTICLE", req, res, next);
};
