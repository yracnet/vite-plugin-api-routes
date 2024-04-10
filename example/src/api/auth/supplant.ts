//@ts-ignore
import { createResponseAsync } from "../../common/response";
import { jwtSign } from "../../middleware/jwt";

//@ts-ignore
export const POST = (req, res, next) => {
  const token = jwtSign({
    name: "User Site",
    roles: ["SITE"],
  });
  res.cookie("token", token, { httpOnly: false });
  return createResponseAsync("Changed in!", req, res, next);
};
