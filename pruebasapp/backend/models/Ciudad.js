import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "../config/database.js";
import Provincia from "./Provincia.js";

class Ciudad extends Model {}

Ciudad.init(
  {
    id_ciudad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    id_provincia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Provincia, // Nombre de la tabla de provincia
        key: "id_provincia",
      },
    },
  },
  {
    sequelize,
    modelName: "Ciudad",
    tableName: "ciudades",
    timestamps: false,
  }
);

export default Ciudad;
