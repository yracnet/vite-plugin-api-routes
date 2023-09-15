// @ts-nocheck
import express from "express";
import { applyRouters } from "@api/routers"; // Notice '@api', this is the moduleId!

export const handler = express();

// Add JSON-Parsing
handler.use(express.json());
handler.use(express.urlencoded({ extended: true }));

applyRouters(
  (props) => {
    const { method, route, path, cb, middlewares } = props;
    if (handler[method]) {
      handler[method](route, ...(middlewares ?? []), cb);
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);
