export const createResponse = (file, req, res, next) => {
  res.send({
    version: req.version,
    copyright: req.copyright,
    file,
    method: req.method,
    path: req.path,
    params: req.params,
    fileRoute: req.fileRoute,
    others: req.others,
  });
};
