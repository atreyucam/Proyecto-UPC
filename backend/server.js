
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { sequelize } = require("./config/database");
const syncDatabase = require("./config/syncDatabase");
const setupSocket = require("./config/socket"); // Configuración modular de socket.io
const setupCronJobs = require("./config/cronJobs");

// * Rutas en funcionamiento
const authRoutes = require("./routes/auth");
const circuitoRoutes = require("./routes/circuito");
const personaRoutes = require("./routes/persona");
const subtipoRoutes = require("./routes/subtipo");
const solicitudRoutes = require("./routes/solicitud");
const estadisticasRoutes = require("./routes/estadisticas");
const reportesRoutes = require("./routes/reportes");

const app = express();
const server = http.createServer(app);
const io = setupSocket(server); // Configurar socket.io de manera modular
app.set("socketio", io);
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" })); // Reemplazar "*" por dominios permitidos en producción
app.use(express.json());

// 📌 Sincronización de base de datos
syncDatabase();

// 📌 Middleware para Socket.IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 📌 Rutas
app.use("/circuitos", circuitoRoutes);
app.use("/subtipos", subtipoRoutes);
app.use("/estadisticas", estadisticasRoutes);
app.use("/auth", authRoutes);
app.use("/solicitud", solicitudRoutes);
app.use("/persona", personaRoutes);
app.use("/reportes", reportesRoutes);
setupCronJobs();
// Verifica qué rutas están registradas en Express
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
      console.log(`🔹 Ruta registrada: ${r.route.path}`);
  }
});


// 📌 Iniciar Servidor
server.listen(port, "0.0.0.0", async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);

  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida con éxito.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
});
