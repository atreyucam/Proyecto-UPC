const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/ctr.estadisticas');

// asignaciones
router.get('/contadorePolicias', estadisticasController.getPoliciaCountsController);


// home
router.get('/contadorSolicitudesTotales', estadisticasController.getContadorSolicitudesTotal);

module.exports = router;