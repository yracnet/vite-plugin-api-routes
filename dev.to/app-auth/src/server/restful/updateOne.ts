import { ApiFunction } from "_server/types";
import { Model, ModelStatic } from "sequelize";
import { NOPE } from "./common";

export type UpdateOneOptions<R = any> = {
  paramPk?: string;
  parsePayload?: (data: R) => Promise<R> | R;
};

export const createUpdateOne = <M extends Model>(
  handler: ModelStatic<M>,
  { paramPk = "id", parsePayload = NOPE }: UpdateOneOptions
): ApiFunction => {
  return async (req, res, next) => {
    try {
      const pk = req.params[paramPk];
      const data = await parsePayload(req.body);
      const item = await handler.findByPk(pk);
      if (item) {
        await item.update(data);
        res.json(item);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  };
};
