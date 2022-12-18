import { routers } from "virtual:vite-plugin-api:router";

export const GET = (req, res, next) => {
  res.send(routers);
};
