const express = require("express");
const router = express.Router();
const estadisticasController = require("../controllers/ctr.estadisticas");

// asignaciones
router.get(
    "/contadorePolicias",
    estadisticasController.getPoliciaCountsController
);

// home
router.get(
    "/contadorSolicitudesTotales",
    estadisticasController.getContadorSolicitudesTotal
);
router.get(
    "/tiposTotales",
    estadisticasController.getContadorSolicitudesPorTipo
);

router.get(
    "/solicitudesFiltradas",
    estadisticasController.getSolicitudesFiltradasController
);
router.get("/resumen", estadisticasController.getResumenSolicitudes);
// Ruta para obtener solicitudes filtradas
router.get(
    "/solicitudesFiltradas2",
    estadisticasController.getSolicitudesFiltradasController2
);

router.get(
    "/subtiposPorTipoTablas",
    estadisticasController.getSubtiposPorTipoTablasController
);

module.exports = router;
