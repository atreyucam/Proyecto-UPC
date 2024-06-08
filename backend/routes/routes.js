const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const personaController = require('../controllers/persona');
const circuitoController = require('../controllers/circuito');
const tipoSolicitudController = require('../controllers/tipoSolicitud');
const subtipoController = require('../controllers/subtipoSolicitud');

// Rutas para roles
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRol);
router.get('/roles/:id', roleController.getRoleById);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

// Ruta para personas
router.post('/personas', personaController.createPersona);
router.get('/personas', personaController.getAllPersona);
router.get('/personas/:id_persona', personaController.getPersonaById);
router.put('/personas/:id_persona', personaController.updatePersona);
router.delete('/personas/:id_persona', personaController.deletePersona);

// Ruta para circuitos
router.post('/circuitos', circuitoController.createCircuito);
router.get('/circuitos', circuitoController.getAllCircuito);
router.get('/circuitos/:id', circuitoController.getCircuitoByid);
router.put('/circuitos/:id', circuitoController.updateCircuito);
router.delete('/circuitos/:id', circuitoController.deleteCircuito);

//Ruta de tipos de solicitud
// router.post('/tipoSolicitud', tipoSolicitudController.createTipoSolicitud);
router.post('/tipoSolicitud', tipoSolicitudController.createTipoSolicitudWithSubtipos);
router.get('/tipoSolicitud', tipoSolicitudController.getAllTipoSolicitud);
router.get('/tipoSolicitud/:id_tipo', tipoSolicitudController.getTipoSolicitudById);
router.put('/tipoSolicitud/:id_tipo', tipoSolicitudController.updateTipoSolicitud);
router.delete('/tipoSolicitud/:id_tipo', tipoSolicitudController.deleteTipoSolicitud);

//Ruta de tipos de solicitud
router.post('/subtipo/tipoSolicitud/:id_tipo', subtipoController.createSubtipoForTipo);
router.get('/subtipo', subtipoController.getAllSubtipos);
router.get('/subtipo/:id_subtipo', subtipoController.getSubtipoById);
router.put('/subtipo/:id_subtipo', subtipoController.updateSubtipo);
router.delete('/subtipo/:id_subtipo', subtipoController.deleteSubtipo);

module.exports = router;
