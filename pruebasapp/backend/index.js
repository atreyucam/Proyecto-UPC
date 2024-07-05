//DEPENMDENCIAS
import express from "express";
import initializeModels from "./config/syncModels.js";
import dotenv from "dotenv";
import conectarDB from "./config/database.js";
import cors from "cors";
//IMPORTACIONES DE RUTAS
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import ubicacionesRoutes from "./routes/ubicaciones.routes.js";
import rolesRoutes from "./routes/roles.routes.js";

// Middlewares
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// Obtiene la ruta del directorio actual
app.use("/src/uploads", express.static("src/uploads"));
app.use(express.json());

// Usar las rutas
/* app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/api/roles", rolesRoutes);
 */
//INICIALIZAR EL SERVIDOR
const iniciarServidor = async () => {
  await conectarDB(); // Espera a que se complete la conexión a la base de datos
  //await initializeModels();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {  // Asegúrate de que el servidor escucha en todas las interfaces
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

iniciarServidor().catch((error) => {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
});
