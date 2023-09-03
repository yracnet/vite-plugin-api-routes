import { createResponse } from "../../../response.js";

//@ts-ignore
export const GET = (req, res, next) => {
  createResponse("v2/user/[userId].ts", req, res, next);
};

//@ts-ignore
export const DELETE = (req, res, next) => {
  createResponse("v2/user/[userId].ts", req, res, next);
};

//@ts-ignore
export const PUT = (req, res, next) => {
  createResponse("v2/user/[userId].ts", req, res, next);
};
