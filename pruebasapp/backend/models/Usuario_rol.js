import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Usuario from "./Usuario.js";
import Rol from "./Rol.js";

class Usuario_rol extends Model {}

Usuario_rol.init(
  {
    id_usuario_rol: {
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
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Rol,
        key: "id_rol",
      },
    },
  },
  {
    sequelize,
    modelName: "Usuario_rol",
    tableName: "usuarios_roles",
    timestamps: false,
  }
);

// Definir las relaciones con los modelos Usuario y Rol
Usuario_rol.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Usuario_rol.belongsTo(Rol, {
  foreignKey: "id_rol",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Usuario_rol;
