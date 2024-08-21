require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = process.env.DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

console.log({
  DATABASE: process.env.DATABASE,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
});

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  logging: console.log,
  define: {
    timestamps: false
  }
});

module.exports = {
  sequelize
};
