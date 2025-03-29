import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DEFINE_ID, instance } from "../database";

export interface ProfileModel
  extends Model<
    InferAttributes<ProfileModel>,
    InferCreationAttributes<ProfileModel>
  > {
  id: CreationOptional<string>;
  name: string;
  description: string;
  status: string;
}

export const profileRepository = instance.define<ProfileModel>(
  "Profile",
  {
    id: DEFINE_ID,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "auth_profiles",
    createdAt: true,
    updatedAt: true,
  }
);
