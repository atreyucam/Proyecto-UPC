const { sequelize } = require("./database");

// Comprobacion de tablas en PostgreSQL
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Tablas sincronizadas");
    } catch (error) {
        console.error("Error al sincronizar las tablas:", error);
    }
};

module.exports = syncDatabase;
