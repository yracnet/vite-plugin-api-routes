export default (error, _, res, next) => {
  if (error instanceof Error) {
    res
      .status(403)
      .json({ name: "ERROR HANDLER!!!!!!!!!", error: error.message });
  } else {
    next(error);
  }
};
