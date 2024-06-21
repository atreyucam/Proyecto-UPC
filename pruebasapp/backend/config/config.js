import dotenv from "dotenv";

dotenv.config();

export const development = {
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  dialect: "mysql", // Asegúrate de que el dialecto coincide con tu base de datos
  port: process.env.MYSQL_PORT,
};

export const secret = process.env.JWT_SECRET;
