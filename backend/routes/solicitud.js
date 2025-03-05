const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/ctr_solicitud');
const authenticateJWT = require('../middleware/authMiddleware');



router.get('/', solicitudController.getSolicitudes);

router.get('/solicitudesPendientes', solicitudController.getSolicitudesPendientes);
router.get('/top10solicitudes', solicitudController.top10SolicitudesRecientes);



// rutas
// Acciones de solicitudes
router.post('/nuevoBotonEmergencia', solicitudController.crearBotonEmergencia);
router.post('/nuevaSolicitud', solicitudController.crearSolicitud);
router.get('/:id', solicitudController.getSolicitudById);

// Acciones de policias en solicitudes
router.post('/asignarPolicia',solicitudController.asignarPolicia);
router.post('/cerrarSolicitud', solicitudController.cerrarSolicitud);
router.post('/agregarObservacion', solicitudController.agregarObservacion);

module.exports = router;