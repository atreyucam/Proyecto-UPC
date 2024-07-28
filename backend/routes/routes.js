const express = require('express');
const router = express.Router();

const personaController = require('../controllers/persona');


const subtipoController = require('../controllers/subtipoSolicitud');
const solicitudController = require('../controllers/solicitud');


// Ruta para personas
router.post('/personas', personaController.createPersona);
router.get('/personas', personaController.getAllPersona);
router.get('/personas/:id_persona', personaController.getPersonaById);
router.put('/personas/:id_persona', personaController.updatePersona);
router.delete('/personas/:id_persona', personaController.deletePersona);
// nuevos filtros para personas
router.get('/ciudadanos', personaController.getCiudadanos);
router.get("/ciudadanos/:id", personaController.getCiudadanoById);
router.get('/policias', personaController.getPolicias);
router.put("/policias/:id", personaController.updatePolicia);
router.delete("/policias/:id", personaController.deletePolicia);
router.get("/policias/:id", personaController.getPoliciaById);

router.get('/ciudadanoPolicia', personaController.getCiudadanosPolicias);
router.get('/adminCiudadanoPolicia', personaController.getAdminCiudadanosPolicias);



//Ruta de tipos de solicitud
router.post('/subtipo/tipoSolicitud/:id_tipo', subtipoController.createSubtipoForTipo);
router.get('/subtipo', subtipoController.getAllSubtipos);
router.get('/subtipo/:id_subtipo', subtipoController.getSubtipoById);
router.put('/subtipo/:id_subtipo', subtipoController.updateSubtipo);
router.delete('/subtipo/:id_subtipo', subtipoController.deleteSubtipo);
router.get('/tipos/:id_tipo/subtipos', subtipoController.getSubtiposByTipo);


// Rutas de solicitud por parte del usuario
router.post('/solicitud', solicitudController.createSolicitud);
router.get('/solicitud', solicitudController.getAllSolicitudes);
// ruta nueva
router.get('/solicitudPersona', solicitudController.getAllSolicitudesPersona);

router.get('/solicitud/:id', solicitudController.getSolicitudById);
router.put('/solicitud/:id', solicitudController.updateSolicitud);
router.delete('/solicitud/:id', solicitudController.deleteSolicitud);
router.post('/solicitud/:id/assign', solicitudController.assignPolicia);
router.post('/solicitud/:id/resolve', solicitudController.resolveSolicitud);
router.post('/solicitud/:id/event', solicitudController.registrarEvento);  // Nueva ruta para registrar eventos
router.get('/solicitud/fullinfo/:id', solicitudController.getSolicitudFullInfo);
router.get('/solicitudes', solicitudController.getAllSolicitudesFullInfo);
router.get('/estadoSolicitudes', solicitudController.getAllEstados);
router.get('/filtrosSolicitudes', solicitudController.getFilteredSolicitudes);

// Nuevas rutas para uso del filtro de -> provincias, ciudades y barrios
router.get('/provincias', circuitoController.getAllProvincias);

router.get('/ciudades/:provincia', circuitoController.getCiudadesByProvincia);
router.get('/barrios/:provincia/:ciudad', circuitoController.getBarriosByCiudad);



// detalles de policia y soliciedes


// rutas para estadisticas de policia
router.get('/solicitudes/estadisticas', solicitudController.getEstadisticasSolicitudes);
router.get('/policias/estadisticas', solicitudController.getEstadisticasPolicias);
router.get('/solicitudes/tipos', solicitudController.getSolicitudesPorTipo);
router.get('/solicitudes/actividades', solicitudController.getActividadesRecientes);


module.exports = router;
