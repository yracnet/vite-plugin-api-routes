import express from "express";
import { routeBase, applyRouters } from "virtual:vite-plugin-api:router";

export const handler = express();

const router = express.Router();
handler.use(routeBase, router);

applyRouters(
  (props) => {
    const { method, route, cb } = props;
    if (router[method]) {
      router[method](route, cb);
    } else {
      console.log(method, "Not support!");
    }
  },
  (cb) => async (req, res, next) => {
    // Prevent double method registed
    if (!res.finished) {
      try {
        let value = await cb(req, res, next);
        if (value) {
          res.send(value);
        }
      } catch (error) {
        next(error);
      }
    }
  }
);
