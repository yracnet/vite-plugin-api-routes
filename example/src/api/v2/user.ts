//@ts-ignore
export default (req, res, next) => {
  req.copyright = "HOC FOR AUTH REQUEST - TS";
  next();
};

//@ts-ignore
export const GET = (req, res, next) => {
  // Double declaration in /v2/user.ts:GET and /v2/user/index.ts:GET
  console.log("GET /v2/user in /v2/user.ts");
  //res.send({ ok: true });
  next();
};
