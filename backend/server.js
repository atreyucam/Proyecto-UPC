require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { sequelize } = require('./config/database');
const syncDatabase = require('./config/syncDatabase');

// * Rutas en funcionamiento
const circuitoRoutes = require('./routes/circuito');
const personaRoutes = require('./routes/persona');
const subtipoRoutes = require('./routes/subtipo');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Comprobación de tablas en PostgreSQL
syncDatabase();

// * Rutas en funcionamiento
app.use('/circuitos', circuitoRoutes);
app.use('/personas', personaRoutes);
app.use('/subtipo', subtipoRoutes);


app.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});