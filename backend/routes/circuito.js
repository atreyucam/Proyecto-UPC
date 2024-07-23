const express = require('express');
const router = express.Router();
const circuitoController = require('../controllers/ctr_circuito');

// * Rutas del CRUD basico
// * En funcionamiento
router.post('/', circuitoController.createCircuito);
router.get('/', circuitoController.getCircuitos);
router.get('/:id', circuitoController.getCircuitoById);
router.put('/:id', circuitoController.updateCircuito);
router.delete('/:id', circuitoController.deleteCircuito);

module.exports = router;