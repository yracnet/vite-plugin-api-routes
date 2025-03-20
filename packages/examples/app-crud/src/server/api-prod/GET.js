const PING = (req, res, next) => {
  res.status(200).json({ env: "IN PRODUCION" });
};

export default PING;
