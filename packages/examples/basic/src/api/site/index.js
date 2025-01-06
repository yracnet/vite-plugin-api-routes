import { createResponse } from "../../common/response";

export const GET = (req, res, next) => {
  createResponse("PING EXAMPLE", req, res, next);
};
