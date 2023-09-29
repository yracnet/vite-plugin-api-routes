import { createResponse } from "../../../common/response.js";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/index.ts", req, res, next);
};

//@ts-ignore
export const POST = (req, res, next) => {
  res.cookie("user", "NEW-USER");
  createResponse("v2/user/index.ts", req, res, next);
};
