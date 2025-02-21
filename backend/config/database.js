require('dotenv').config();
const { Sequelize } = require('sequelize');

// Si DATABASE_URL existe, usa la base de datos en Render
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log,
      define: { timestamps: false },
      dialectOptions: {
        ssl: {
          require: true, // 🔴 Requerir SSL
          rejectUnauthorized: false // 🔴 Evitar problemas con certificados autofirmados
        }
      }
    })
  : new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: console.log,
      define: { timestamps: false }
    });

module.exports = { sequelize };
