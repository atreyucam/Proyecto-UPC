import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class TipoDenuncia extends Model {}

TipoDenuncia.init(
  {
    id_tipo_denuncia: {
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
    modelName: "TipoDenuncia",
    tableName: "tipos_denuncia",
    timestamps: false,
  }
);

export default TipoDenuncia;
