const isAsync = (value) => value instanceof (async () => {}).constructor;
const isPromise = (value) => value instanceof Promise;

export const applyServer = (server, applyRouters) => {
  applyRouters((method, route, callback) => {
    const callbackAsync = async (req, res, next) => {
      const isAwait = isAsync(callback) || isPromise(callback);
      if (isAwait) {
        try {
          let result = await callback(req, res, next);
          res.send(result);
        } catch (error) {
          res.error = error;
          next();
        }
      } else {
        callback(req, res, next);
      }
    };
    if (server[method]) {
      server[method](route, callbackAsync);
    } else {
      server.post(route, (req, res, next) => {
        if (req.headers["xxx-method"] === method) {
          callbackAsync(req, res, next);
        } else {
          next();
        }
      });
    }
  });
};
