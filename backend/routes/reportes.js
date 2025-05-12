const express = require("express");
const router = express.Router();
const {
    getResumenGeneral,
    getSolicitudesPorTipo,
    getSolicitudesPorUbicacion,
    getTiempoResolucion,
    getDesempenoPolicial,
    getTiposEmergencias,
    getMapaIncidencias,
    getInformesAdministrativos,
    getreporteGeneral
} = require("../controllers/ctr_reportes");

// 📌 Rutas para Reportes por Niveles
router.get("/resumen", getResumenGeneral);               // Nivel 1
router.get("/por-tipo", getSolicitudesPorTipo);          // Nivel 2
router.get("/por-ubicacion", getSolicitudesPorUbicacion);// Nivel 3
router.get("/tiempo-resolucion", getTiempoResolucion);   // Nivel 4
router.get("/desempeno-policial", getDesempenoPolicial); // Nivel 5
router.get("/tipos-emergencias", getTiposEmergencias);   // Nivel 6
router.get("/mapa-incidencias", getMapaIncidencias);     // Nivel 7
router.get("/informes-administrativos", getInformesAdministrativos);
router.get("/general", getreporteGeneral);

module.exports = router;
