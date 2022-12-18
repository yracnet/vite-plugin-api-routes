//@ts-ignore
import { createResponseAsync } from "../../response";

//@ts-ignore
export const GET = async (req, res, next) => {
  return createResponseAsync("v2/auth/login.ts", req, res, next);
};
//@ts-ignore
export const POST = async (req, res, next) => {
  return createResponseAsync("v2/auth/login.ts", req, res, next);
};
