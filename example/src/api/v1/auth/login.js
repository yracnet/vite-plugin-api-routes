import { createResponse } from "../../response";

export const GET = (req, res, next) => {
  createResponse("v1/auth/login.js", req, res, next);
};

export const POST = (req, res, next) => {
  createResponse("v1/auth/login.js", req, res, next);
};
