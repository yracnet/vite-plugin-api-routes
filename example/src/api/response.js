export const createResponse = (message, req, res, next) => {
  res.send({
    source: "sync",
    version: req.version,
    copyright: req.copyright,
    message,
    method: req.method,
    path: req.path,
    params: req.params,
  });
};

export const createResponseAsync = async (message, req, res, next) => {
  return res.send({
    source: "async",
    version: req.version,
    copyright: req.copyright,
    message,
    method: req.method,
    path: req.path,
    params: req.params,
  });
};
