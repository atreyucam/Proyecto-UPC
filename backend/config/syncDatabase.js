const { sequelize } = require("./database");
const initData = require("./initData");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Cambiado `force: false` por `alter: true` para mantener datos
    console.log("✅ Tablas sincronizadas correctamente.");

    // 📌 Insertar datos iniciales si no existen
    await initData();
  } catch (error) {
    console.error("❌ Error al sincronizar las tablas:", error);
  }
};

module.exports = syncDatabase;
