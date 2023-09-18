// @ts-nocheck
import { applyRouters } from "@api/routers"; // Notice '@api', this is the moduleId!
import express from "express";

export const handler = express();

// Add JSON-Parsing
handler.use(express.json());
handler.use(express.urlencoded({ extended: true }));

applyRouters(
  (props) => {
    const { method, route, path, cb } = props;
    if (handler[method]) {
      if (Array.isArray(cb)) {
        handler[method](route, ...cb);
      } else {
        handler[method](route, cb);
      }
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);
