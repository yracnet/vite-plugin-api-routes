import { ApiFunction } from "_server/types";
import { Model, ModelStatic } from "sequelize";
import { NOPE } from "./common";

export type CreateOneOptions<R = any> = {
  parsePayload?: (data: R) => Promise<R> | R;
};

export const createCreateOne = <M extends Model>(
  handler: ModelStatic<M>,
  { parsePayload = NOPE }: CreateOneOptions
): ApiFunction => {
  return async (req, res, next) => {
    try {
      const data: any = await parsePayload(req.body);
      const newItem = await handler.create(data);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  };
};
