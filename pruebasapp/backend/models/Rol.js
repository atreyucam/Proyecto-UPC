import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database.js";

class Rol extends Model {}

Rol.init(
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Rol",
    tableName: "roles",
    timestamps: false,
  }
);

export default Rol;
