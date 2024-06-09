require('dotenv').config();
const { sequelize } = require('./config/database');
const modelo = require('./models/db_models')
const express = require('express');
// Importar las rutas
const roleRoutes = require('./routes/routes');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// Comprobacion de tablas en PostgreSQL
sequelize.sync({ force: false }).then(() => {
  console.log("Tablas sincronizadas");
}).catch(error => {
  console.error('Error al sincronizar las tablas:', error);
});

// Usar las rutas
app.use('/api', roleRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
