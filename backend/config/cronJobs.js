const cron = require("node-cron");
const { eliminarNotificacionesAntiguas } = require("../services/srv_notificacion");

// Ejecutar limpieza cada 24 horas
const setupCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("🕒 Ejecutando limpieza de notificaciones antiguas...");
        await eliminarNotificacionesAntiguas();
    });
};

// Exportar correctamente la función
module.exports = setupCronJobs;