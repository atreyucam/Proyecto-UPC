import Sequelize from "sequelize";
import dotenv from "dotenv";
import { development } from "./config.js";

dotenv.config();

const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: development.dialect,
    port: development.port,
    logging: console.log,
  }
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a MYSQL");
  } catch (error) {
    console.error(`Error de conexión a MYSQL: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;
export { sequelize };
