import { ApiFunction } from "_server/types";
import { Model, ModelStatic } from "sequelize";

export type DeleteOneOptions = {
  paramPk?: string;
};

export const createDeleteOne = <M extends Model>(
  handler: ModelStatic<M>,
  { paramPk = "id" }: DeleteOneOptions
): ApiFunction => {
  return async (req, res, next) => {
    try {
      const pk = req.params[paramPk];
      const item = await handler.findByPk(pk);
      if (item) {
        await item.destroy();
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  };
};
