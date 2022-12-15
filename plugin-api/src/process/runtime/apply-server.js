export const applyServer = (server, applyRouters) => {
  applyRouters((method, route, callback) => {
    if (server[method]) {
      server[method](route, callback);
    } else {
      server.post(route, (req, res, next) => {
        if (req.headers["xxx-method"] === method) {
          callback(req, res, next);
        } else {
          next();
        }
      });
    }
  });
};
