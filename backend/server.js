const { sequelize } = require('./src/config/database');
const modelo = require('./src/models/db_models');

const routeApp = require('./src/routes/appRoutes');
const express = require("express");
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Reemplaza con la URL de tu aplicación frontend
  credentials: true,
}));

// Comprobacion de tablas en PostgreSQL
sequelize.sync({ force: false }).then(() => {
    console.log("Tablas sincronizadas");
}).catch(error => {
    console.error('Error al sincronizar las tablas:', error);
});

app.use(express.json());
app.use('/api', routeApp);
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`UPC en http://localhost:${port}`);
});