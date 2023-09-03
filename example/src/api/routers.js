import { routers } from "@api/routers";
export const GET = (req, res, next) => {
  res.send(routers);
};
