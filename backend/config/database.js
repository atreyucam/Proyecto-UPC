require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = "db_upc_dev";
const username = "postgres";
const password = "1234";
const host = "localhost";

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
