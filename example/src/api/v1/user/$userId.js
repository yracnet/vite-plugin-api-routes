import { createResponse } from "../../response";

export const GET = (req, res, next) => {
  createResponse("v1/user/$userId.js", req, res, next);
};

export const DELETE = (req, res, next) => {
  createResponse("v1/user/$userId.js", req, res, next);
};

export const PUT = (req, res, next) => {
  createResponse("v1/user/$userId.js", req, res, next);
};
