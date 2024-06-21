import { sequelize } from "./database.js";
import seedDataBase from "./seedDataBase.js";

import Usuario from "../models/Usuario.js";
import Ciudad from "../models/Ciudad.js";
import Rol from "../models/Rol.js"
import Provincia from "../models/Provincia.js";
import Estado_usuario from "../models/Estadousuario.js";


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
