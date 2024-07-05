import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Estacion extends Model {}

Estacion.init(
  {
    id_estacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Estacion",
    tableName: "estaciones",
    timestamps: false,
  }
);

export default Estacion;
