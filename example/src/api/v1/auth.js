export default (req, res, next) => {
  req.copyright = "HOC FOR AUTH REQUEST";
  next();
};
