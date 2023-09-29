import { createResponse } from "../../../common/response.js";

export const GET = (req, res, next) => {
  const { pageId } = req.params;
  createResponse("GET PAGE: " + pageId, req, res, next);
};
