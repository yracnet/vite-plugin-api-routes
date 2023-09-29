import { createResponse } from "../../../../common/response.js";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/[userId].ts", req, res, next);
};

//@ts-ignore
export const DELETE = (req, res, next) => {
  res.clearCookie("user");
  createResponse("v2/user/[userId].ts", req, res, next);
};

//@ts-ignore
export const PUT = (req, res, next) => {
  res.cookie("user", "UPDATE-USER");
  createResponse("v2/user/[userId].ts", req, res, next);
};
