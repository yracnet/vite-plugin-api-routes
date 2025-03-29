import { ApiFunction } from "_server/types";
import { Model, ModelStatic } from "sequelize";
import { parseQuery, QueryOptions } from "./common";

export type GetManyOptions = {
  queryOpts?: QueryOptions;
};

export const createGetMany = <M extends Model>(
  handler: ModelStatic<M>,
  { queryOpts }: GetManyOptions
): ApiFunction => {
  return async (req, res, next) => {
    try {
      const {
        offset = 0,
        limit = 10,
        where = {},
        order = [],
      } = parseQuery(req.query, queryOpts);
      const { count, rows } = await handler.findAndCountAll({
        where,
        order,
        offset,
        limit,
      });
      res.setHeader("Content-Range", `rows ${offset}-${limit}/${count}`);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  };
};
