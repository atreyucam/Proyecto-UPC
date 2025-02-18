const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/ctr_solicitud');
const authenticateJWT = require('../middleware/authMiddleware');

// TODO: En revision
// ! Rutas inestables
router.post('/nuevoBotonEmergencia', solicitudController.crearBotonEmergencia);
router.get('/', solicitudController.getSolicitudes);

router.post('/nuevaSolicitud', solicitudController.crearSolicitud);
router.get('/solicitudesPendientes', solicitudController.getSolicitudesPendientes);
router.get('/top10solicitudes', solicitudController.top10SolicitudesRecientes);



router.get('/:id', solicitudController.getSolicitudById);
router.post('/asignarPolicia',authenticateJWT,solicitudController.asignarPolicia);
router.post('/cerrarSolicitud', solicitudController.cerrarSolicitud);
router.post('/agregarObservacion', solicitudController.agregarObservacion);

module.exports = router;