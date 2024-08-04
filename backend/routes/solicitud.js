const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/ctr_solicitud');

// TODO: En revision
// ! Rutas inestables
router.post('/nuevoBotonEmergencia', solicitudController.crearBotonEmergencia);
router.get('/', solicitudController.getSolicitudes);
router.post('/asignarPolicia', solicitudController.asignarPoliciaSolicitud);
router.post('/cerrarSolicitud', solicitudController.cerrarSolicitud);
router.post('/agregarObservacion', solicitudController.agregarObservacion);

module.exports = router;