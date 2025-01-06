import { createResponse } from "../../../common/response";
const order = 0;
export const GET = (req, res, next) => {
  createResponse("NEW ARTICLE", req, res, next);
};
