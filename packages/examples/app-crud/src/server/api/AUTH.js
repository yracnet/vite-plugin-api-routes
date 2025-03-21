export default (req, res, next) => {
  req.data = "AUTH HANDLER";
  next();
};
