import { createResponse } from "../../../../../common/response.js";

//@ts-ignore
export const POST = (req, res, next) => {
  res.cookie("user", "ACTION-USER");
  createResponse("v2/user/[userId]/[action]/index.ts", req, res, next);
};
