import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Usuario from "./Usuario.js";
import TipoDenuncia from "./TipoDenuncia.js";
import Estado_denuncia from "./Estado_denuncia.js";

class Denuncia extends Model {}

Denuncia.init(
  {
    id_denuncia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_tipo_denuncia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TipoDenuncia,
        key: "id_tipo_denuncia",
      },
    },
    evidencia: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latitud: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitud: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    id_estado_denuncia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Estado_denuncia,
        key: "id_estado_denuncia",
      },
    },
  },
  {
    sequelize,
    modelName: "Denuncia",
    tableName: "denuncias",
    timestamps: false,
  }
);

// Definir las relaciones con los modelos Usuario, EstadoDenuncia y TipoDenuncia
Denuncia.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Denuncia.belongsTo(Estado_denuncia, {
  foreignKey: "id_estado_denuncia",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Denuncia.belongsTo(TipoDenuncia, {
  foreignKey: "id_tipo_denuncia",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

export default Denuncia;
