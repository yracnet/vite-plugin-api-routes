import path from "path";
import { DataTypes, Sequelize } from "sequelize";
export const instance = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "db/data.db"),
  logging: false,
});

export const DEFINE_ID = {
  primaryKey: true,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  allowNull: false,
};
