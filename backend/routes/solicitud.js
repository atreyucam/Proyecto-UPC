const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/ctr_solicitud');

// 🔹 Rutas más específicas primero
router.get('/policiasDisponibles', solicitudController.obtenerPoliciasDisponibles);
router.get('/solicitudesPendientes', solicitudController.getSolicitudesPendientes);
router.get('/top10solicitudes', solicitudController.top10SolicitudesRecientes);
router.get('/', solicitudController.getSolicitudes);

// 🔹 Acciones de solicitudes
router.post('/nuevoBotonEmergencia', solicitudController.crearBotonEmergencia);
router.post('/nuevaSolicitud', solicitudController.crearSolicitud);

// 🔹 Acciones de policías en solicitudes
router.post('/asignarPolicia', solicitudController.asignarPolicia);
router.post('/cerrarSolicitud', solicitudController.cerrarSolicitud);
router.post('/agregarObservacion', solicitudController.agregarObservacion);

// 🔹 📌 Esta ruta debe estar AL FINAL para evitar conflictos con otras rutas GET
router.get('/:id', solicitudController.getSolicitudById);

module.exports = router;
