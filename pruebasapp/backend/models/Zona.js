import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Zona extends Model {}

Zona.init(
  {
    id_zona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    provincia: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    barrio: DataTypes.STRING,
    numeroZona: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Zona",
    tableName: "zonas",
    timestamps: false,
  }
);
