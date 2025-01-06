import { createResponse } from "../../../../common/response";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/[userId].ts", req, res, next);
};
