import { sequelize } from "./database.js";
import seedDataBase from "./seedDataBase.js";

import Rol from "../models/Rol.js";
import Zona from "../models/Zona.js";
import Estacion from "../models/Estacion.js";
import Estado_usuario from "../models/Estado_usuario.js";
import TipoDenuncia from "../models/TipoDenuncia.js";
import Estado_denuncia from "../models/Estado_denuncia.js";
import Usuario from "../models/Usuario.js";
import Policia from "../models/Policia.js";
import Usuario_rol from "../models/Usuario_rol.js";
import Provincia from "../models/Provincia.js";
import Ciudad from "../models/Ciudad.js";
import Denuncia from "../models/Denuncia.js";


const initializeModels = async () => {
  try {
    // Importar modelos para sincronización
    await sequelize.sync({ force: true });
    console.log("Base de datos sincronizada");
    // Llamar a la función para sembrar datos
    await seedDataBase();
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
};

export default initializeModels;
