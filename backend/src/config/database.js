const { Sequelize } = require('sequelize');

const database = "upc";
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
}