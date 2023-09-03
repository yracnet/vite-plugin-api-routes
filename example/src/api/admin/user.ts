//@ts-ignore
export default (req, res, next) => {
  req.copyright = "HOC FOR AUTH REQUEST - TS";
  next();
};

//@ts-ignore
export const GET = (req, res, next) => {
  //res.send({ ok: true });
  next();
};
