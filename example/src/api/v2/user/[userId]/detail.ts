//@ts-ignore
import { createResponse } from "../../../response";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/[userId]/detail.ts", req, res, next);
};
