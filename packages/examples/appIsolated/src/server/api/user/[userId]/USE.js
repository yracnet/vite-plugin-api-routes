export default (req, res, next) => {
  const { userId } = req.params;
  console.log("LOG: USE_USER_BY_ID ", userId, req.originalUrl);
  next();
};
