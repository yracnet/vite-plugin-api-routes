export const createResponse = (file, req, res, next) => {
  res.send({
    source: "sync",
    version: req.version,
    copyright: req.copyright,
    file,
    method: req.method,
    path: req.path,
    params: req.params,
  });
};

export const createResponseAsync = async (file, req, res, next) => {
  return {
    source: "async",
    version: req.version,
    copyright: req.copyright,
    file,
    method: req.method,
    path: req.path,
    params: req.params,
  };
};
