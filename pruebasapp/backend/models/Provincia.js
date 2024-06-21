import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database.js";

class Provincia extends Model {}

Provincia.init(
  {
    id_provincia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false, 
    },
  },
  {
    sequelize,
    modelName: "Provincia",
    tableName: "provincias",
    timestamps: false,
    name: {
      singular: "Provincia",
      plural: "Provincias",
    },
  }
);

export default Provincia;
