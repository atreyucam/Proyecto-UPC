require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

// Si existe DATABASE_URL, úsala (para Docker/producción)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    define: { timestamps: false },
  });
} else {
  // Si no, usa las variables tradicionales (para desarrollo local)
  const { DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
  sequelize = new Sequelize(DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
    define: { timestamps: false },
  });
}

module.exports = { sequelize };
