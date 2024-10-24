const estadisticasService = require("./services/srv_estadisticas");

// Función para manejar la solicitud de contadores de policías
exports.getPoliciaCountsController = async (req, res) => {
    try {
        const counts = await estadisticasService.getPoliciaCounts();
        res.status(200).json(counts);
    } catch (error) {
        console.error("Error al obtener los contadores de policías:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Función para manejar la solicitud de cantidad de solicitudes por tipo del mes actual
exports.getContadorSolicitudesTotal = async (req, res) => {
    try {
        const resultados =
            await estadisticasService.getContadorSolicitudesTotal();
        res.status(200).json(resultados);
    } catch (error) {
        console.error(
            "Error al obtener las solicitudes totales:",
            error.message
        );
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Definimos la ruta para obtener los contadores por tipo

exports.getContadorSolicitudesPorTipo = async (req, res) => {
    try {
        const data = await estadisticasService.getContadorSolicitudesPorTipo();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener solicitudes filtradas por criterios
exports.getSolicitudesFiltradasController = async (req, res) => {
    try {
        const filtros = {
            anio: req.query.anio,
            mes: req.query.mes,
            rangoMesInicio: req.query.rangoMesInicio,
            rangoMesFin: req.query.rangoMesFin,
            tipo: req.query.tipo,
            subtipo: req.query.subtipo,
        };

        const solicitudes = await estadisticasService.getSolicitudesFiltradas(
            filtros
        );
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error("Error al obtener solicitudes filtradas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Ruta para obtener el resumen de solicitudes (con o sin filtro de año)
exports.getResumenSolicitudes = async (req, res) => {
    try {
        const { anio } = req.query; // Recibir año como parámetro opcional
        const resumen = await estadisticasService.getResumenSolicitudes(anio);
        res.status(200).json(resumen);
    } catch (error) {
        console.error("Error en la ruta /resumen:", error);
        res.status(500).json({
            error: "Error al obtener el resumen de solicitudes",
        });
    }
};

//!---------------------------------------------------------------------------
// Obtener solicitudes filtradas por criterios
exports.getSolicitudesFiltradasController2 = async (req, res) => {
    try {
        const filtros = {
            anio: req.query.anio ? parseInt(req.query.anio, 10) : null,
            mes: req.query.mes ? parseInt(req.query.mes, 10) : null,
            rangoMesInicio: req.query.rangoMesInicio
                ? parseInt(req.query.rangoMesInicio, 10)
                : null,
            rangoMesFin: req.query.rangoMesFin
                ? parseInt(req.query.rangoMesFin, 10)
                : null,
        };

        const solicitudes = await estadisticasService.getSolicitudesFiltradas2(
            filtros
        );
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error("Error al obtener solicitudes filtradas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getSubtiposPorTipoTablasController = async (req, res) => {
    try {
        const filtros = {
            anio: req.query.anio ? parseInt(req.query.anio, 10) : null,
            rangoMesInicio: req.query.rangoMesInicio
                ? parseInt(req.query.rangoMesInicio, 10)
                : null,
            rangoMesFin: req.query.rangoMesFin
                ? parseInt(req.query.rangoMesFin, 10)
                : null,
        };

        const subtipos = await estadisticasService.getSubtiposPorTipoTablas(
            filtros
        );
        res.status(200).json(subtipos);
    } catch (error) {
        console.error("Error al obtener los subtipos por tipo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
