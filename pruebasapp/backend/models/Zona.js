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
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
   },
  {
    sequelize,
    modelName: "Zona",
    tableName: "zonas",
    timestamps: false,
  }
);

export default Zona;
