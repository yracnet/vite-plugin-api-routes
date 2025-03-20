const PING = (req, res, next) => {
  res.status(200).json({ env: "IN DEVELOPMENT" });
};

export default PING;
