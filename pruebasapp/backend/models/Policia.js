import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Usuario from "./Usuario.js";
import Estacion from "./Estacion.js";
import Zona from "./Zona.js";

class Policia extends Model {}

Policia.init(
  {
    id_policia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    rango: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    placa: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    id_estacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Estacion,
        key: "id_estacion",
      },
    },

    id_zona: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Zona,
        key: "id_zona",
      },
    },
  },
  {
    sequelize,
    modelName: "Policia",
    tableName: "policias",
    timestamps: false,
  }
);

// Definir las relaciones con los modelos Usuario, Estacion y Zona
Policia.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Policia.belongsTo(Estacion, {
  foreignKey: "id_estacion",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Policia.belongsTo(Zona, {
  foreignKey: "id_zona",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

export default Policia;
