import { createResponse } from "../../../../common/response.js";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/post/[postId].ts", req, res, next);
};