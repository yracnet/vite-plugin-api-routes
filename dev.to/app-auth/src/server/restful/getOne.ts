import { ApiFunction } from "_server/types";
import { Model, ModelStatic } from "sequelize";

export type GetOneOptions = {
  paramPk?: string;
};

export const createGetOne = <M extends Model>(
  handler: ModelStatic<M>,
  { paramPk = "id" }: GetOneOptions
): ApiFunction => {
  return async (req, res, next) => {
    try {
      const id = req.params[paramPk];
      const rol = await handler.findByPk(id);
      if (rol) {
        res.json(rol);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  };
};
