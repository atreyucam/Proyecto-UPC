import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Estado_denuncia extends Model {}

Estado_denuncia.init(
  {
    id_estado_denuncia: {
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
    modelName: "Estado_denuncia",
    tableName: "estados_denuncia",
    timestamps: false,
  }
);

export default Estado_denuncia;
