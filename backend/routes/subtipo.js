const express = require('express');
const router = express.Router();
const subtipoController = require('../controllers/ctr_subtipo');

// * Rutas del CRUD basico
// nuevas rutas
// Ruta para obtener todos los tipos de solicitud
router.get('/tipos', subtipoController.getAllTiposSolicitud);

// Ruta para obtener los subtipos por id de tipo de solicitud
router.get('/tipos/:id_tipo/subtipos', subtipoController.getSubtiposByTipoId);
router.post('/tipoSolicitud/:id_tipo/crearSubtipo', subtipoController.createSubtipoPorTipo);
// * En funcionamiento
router.get('/', subtipoController.getSubtipos);
router.get('/:id', subtipoController.getSubtipoById);
router.put('/:id', subtipoController.updateSubtipo);
router.delete('/:id', subtipoController.deleteSubtipo);



module.exports = router;