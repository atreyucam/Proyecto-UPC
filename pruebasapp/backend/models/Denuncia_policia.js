import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Denuncia from "./Denuncia.js";
import Policia from "./Policia.js";

class Denuncia_policia extends Model {}

Denuncia_policia.init(
  {
    id_denuncia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: Denuncia,
        key: "id_denuncia",
      },
    },
    id_policia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: Policia,
        key: "id_policia",
      },
    },
  },
  {
    sequelize,
    modelName: "Denuncia_policia",
    tableName: "denuncias_policia",
    timestamps: false,
  }
);

Denuncia_policia.belongsTo(Denuncia, {
  foreignKey: "id_denuncia",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Denuncia_policia.belongsTo(Policia, {
  foreignKey: "id_policia",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Denuncia_policia;
