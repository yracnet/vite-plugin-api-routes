import { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import { createCreateOne, CreateOneOptions } from "./createOne";
import { createDeleteOne, DeleteOneOptions } from "./deleteOne";
import { createGetMany, GetManyOptions } from "./getMany";
import { createGetOne, GetOneOptions } from "./getOne";
import { createUpdateOne, UpdateOneOptions } from "./updateOne";

export type CRUDRouterOptions = {
  createOneOpts?: false | CreateOneOptions;
  updateOneOpts?: false | UpdateOneOptions;
  deleteOneOpts?: false | DeleteOneOptions;
  getOneOpts?: false | GetOneOptions;
  getManyOpts?: false | GetManyOptions;
};

export const createCRUDRouter = <M extends Model>(
  handler: ModelStatic<M>,
  {
    createOneOpts = {},
    updateOneOpts = {},
    deleteOneOpts = {},
    getManyOpts = {},
    getOneOpts = {},
  }: CRUDRouterOptions = {}
) => {
  const router = Router();
  getManyOpts && router.get("/", createGetMany(handler, getManyOpts));
  createOneOpts && router.post("/", createCreateOne(handler, createOneOpts));
  getOneOpts && router.get("/:id", createGetOne(handler, getOneOpts));
  updateOneOpts && router.put("/:id", createUpdateOne(handler, updateOneOpts));
  deleteOneOpts &&
    router.delete("/:id", createDeleteOne(handler, deleteOneOpts));
  return router;
};
