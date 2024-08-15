const express = require('express');
const router = express.Router();
const subtipoController = require('../controllers/ctr_subtipo');

// * Rutas del CRUD basico
// * En funcionamiento
router.post('/tipo/:id_tipo/crearSubtipo', subtipoController.createSubtipoPorTipo);
router.get('/', subtipoController.getSubtipos);
router.get('/:id', subtipoController.getSubtipoById);
router.put('/:id', subtipoController.updateSubtipo);
router.delete('/:id', subtipoController.deleteSubtipo);

module.exports = router;