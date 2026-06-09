
const SSR_PAGE = (req, res, next) => {
  res.status(200).json({ m: "SSR /api/*", url: req.url });
};

export default SSR_PAGE;
