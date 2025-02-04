require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { sequelize } = require('./config/database');
const syncDatabase = require('./config/syncDatabase');
// ? pruebas
const http = require('http'); // Requerir el módulo http
const { Server } = require('socket.io'); // Requerir Socket.IO

// ? pruebas

// * Rutas en funcionamiento
const authRoutes = require('./routes/auth.js')
const circuitoRoutes = require('./routes/circuito');
const personaRoutes = require('./routes/persona');
const subtipoRoutes = require('./routes/subtipo');
const solicitudRoutes = require('./routes/solicitud');
const estadisticasRoutes = require('./routes/estadisticas');

const app = express();

// ? pruebas
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas las orígenes para pruebas, restringe en producción
  },
});
// ? pruebas
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Comprobación de tablas en PostgreSQL
syncDatabase();

// ? pruebas
// Middleware para Socket.IO
app.use((req, res, next) => {
  req.io = io; // Añadir el objeto io a las solicitudes
  next();
});

// Manejar conexiones de socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});
// ? pruebas

// * Rutas en funcionamiento
app.use('/circuitos', circuitoRoutes);
app.use('/personas', personaRoutes);
app.use('/subtipos', subtipoRoutes);

// ! Rutas en desarrollo
app.use('/solicitud', solicitudRoutes);
app.use('/estadisticas', estadisticasRoutes);
app.use('/upc',authRoutes);


server.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});