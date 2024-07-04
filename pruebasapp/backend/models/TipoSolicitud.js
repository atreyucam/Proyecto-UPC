import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class TipoSolicitud extends Model {}

TipoSolicitud.init(
    {
        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descripcion: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: "TipoSolicitud",
        tableName: "tipo_solicitudes",
        timestamps: false,
    }
);
