//@ts-ignore
import { createResponse } from "../../response";

//@ts-ignore
export const GET = (req, res, next) => {
  console.log("GET /v2/user in /v2/user/index.ts");
  createResponse("v2/user/index.ts", req, res, next);
};

//@ts-ignore
export const POST = (req, res, next) => {
  createResponse("v2/user/index.ts", req, res, next);
};
