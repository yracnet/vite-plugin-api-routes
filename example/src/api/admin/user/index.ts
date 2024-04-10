import { createResponse } from "../../../common/response";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/index.ts", req, res, next);
};
