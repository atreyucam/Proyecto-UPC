require("dotenv").config();
const { Sequelize } = require("sequelize");

// 📌 Variables de entorno
const { DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  logging: false, // Desactivar logs de SQL en producción
  define: { timestamps: false },
});

module.exports = { sequelize };
