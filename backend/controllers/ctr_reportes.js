const reportesService = require("../services/srv_reportes");

// 📌 Nivel 1: Obtener Resumen General
exports.getResumenGeneral = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const resumen = await reportesService.obtenerResumenGeneral(fechaInicio, fechaFin);
        res.status(200).json(resumen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Nivel 2: Obtener Detalle por Tipo
exports.getSolicitudesPorTipo = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const solicitudesPorTipo = await reportesService.obtenerSolicitudesPorTipo(fechaInicio, fechaFin);
        res.status(200).json(solicitudesPorTipo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📌 Nivel 3: Obtener Distribución Geográfica
exports.getSolicitudesPorUbicacion = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const solicitudesPorUbicacion = await reportesService.obtenerSolicitudesPorUbicacion(fechaInicio, fechaFin);
        res.status(200).json(solicitudesPorUbicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📌 Nivel 4 - Tiempo Promedio de Resolución
exports.getTiempoResolucion = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const data = await reportesService.obtenerTiempoResolucion(fechaInicio, fechaFin);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Nivel 5 - Desempeño Policial
exports.getDesempenoPolicial = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const data = await reportesService.obtenerDesempenoPolicial(fechaInicio, fechaFin);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Nivel 6 - Tipos de Emergencias y Delitos
exports.getTiposEmergencias = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const data = await reportesService.obtenerTiposEmergencias(fechaInicio, fechaFin);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Nivel 7 - Ubicación Geográfica (Mapa de Incidencias)
exports.getMapaIncidencias = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const data = await reportesService.obtenerMapaIncidencias(fechaInicio, fechaFin);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📌 Controlador para informes administrativos
exports.getInformesAdministrativos = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const informes = await reportesService.obtenerInformesAdministrativos(fechaInicio, fechaFin);
        res.status(200).json(informes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getreporteGeneral = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ mensaje: "Debe enviar fechaInicio y fechaFin en el query." });
        }

        const data = await reportesService.obtenerReporteGeneralCompleto(fechaInicio, fechaFin);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};