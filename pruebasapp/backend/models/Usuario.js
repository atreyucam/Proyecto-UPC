import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Estado_usuario from "./Estado_usuario.js";

class Usuario extends Model {}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cedula: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },

    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    genero: {
      type: DataTypes.ENUM("masculino", "femenino", "otro"),
    },
    id_estado_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Estado_usuario, // Modelo de Rol
        key: "id_estado_usuario",
      },
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
  }
);

// Definir restricciones de clave externa

Usuario.belongsTo(Estado_usuario, {
  foreignKey: "id_estado_usuario",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

export default Usuario;
