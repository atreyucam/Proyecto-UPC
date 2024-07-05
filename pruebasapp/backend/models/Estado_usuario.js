import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Estado_usuario extends Model {}

Estado_usuario.init(
  {
    id_estado_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Estado_usuario",
    tableName: "estado_usuario",
    timestamps: false,
  }
);

export default Estado_usuario;
