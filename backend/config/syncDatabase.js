const { sequelize } = require("./database");
const initData = require("./initData");

// Comprobacion de tablas en PostgreSQL
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Tablas sincronizadas");
         // Insertar datos iniciales si no existen
        await initData();
    } catch (error) {
        console.error("Error al sincronizar las tablas:", error);
    }
};

module.exports = syncDatabase;
