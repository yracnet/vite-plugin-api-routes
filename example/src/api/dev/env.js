export const GET = (req, res, next) => {
  res.send({
    "process.env": process.env,
    "vite.env": import.meta.env,
  });
};
