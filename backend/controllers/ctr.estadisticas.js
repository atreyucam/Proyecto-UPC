const estadisticasService = require("../services/srv_estadisticas");
const { getFechasPorPeriodo } = require("../utils/dateUtils");

// Función para manejar la solicitud de contadores de policías
const { getPoliciaCounts } = require("../services/srv_estadisticas");

exports.getPoliciaCountsController = async (req, res) => {
    try {
        const counts = await getPoliciaCounts(req); // ✅ Pasar req en lugar de io
        res.status(200).json(counts);
    } catch (error) {
        console.error("Error al obtener los contadores de policías:", error.message);
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

        const solicitudes = await estadisticasService.getSolicitudesFiltradas( filtros );
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




// nuevos
// HOME
// 🔹 Controlador para obtener el resumen de solicitudes
exports.getSolicitudesResumen = async (req, res) => {
    try {
        const resumen = await estadisticasService.getSolicitudesResumen();
        res.status(200).json(resumen);
    } catch (error) {
        console.error("❌ Error en getSolicitudesResumen:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔹 Obtener solicitudes por tipo en un período determinado
exports.getSolicitudesPorTipo = async (req, res) => {
    try {
        const { periodo } = req.query;
        console.log("📢 Periodo recibido:", periodo);
        const { fechaInicio, fechaFin } = getFechasPorPeriodo(periodo);

        const solicitudes = await estadisticasService.getSolicitudesPorTipo(fechaInicio, fechaFin);

        // Formatear los datos para devolverlos organizados por mes
        const resultado = {};

        solicitudes.forEach(({ mes, tipo, total }) => {
            const nombreMes = obtenerNombreMes(mes);
            if (!resultado[nombreMes]) resultado[nombreMes] = [];

            resultado[nombreMes].push({
                tipo,
                total
            });
        });

        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ Error en getSolicitudesPorTipo:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔹 Función auxiliar para obtener el nombre del mes
const obtenerNombreMes = (numeroMes) => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numeroMes - 1]; // Restamos 1 porque los meses en PostgreSQL empiezan en 1
};


// 🔹 Obtener solicitudes por estado en un período determinado
exports.getSolicitudesPorEstado = async (req, res) => {
    try {
        const { periodo } = req.query;
        console.log("📢 Periodo recibido:", periodo);
        const { fechaInicio, fechaFin } = getFechasPorPeriodo(periodo);
        console.log("📢 fechas:", fechaInicio, " y ", fechaFin);

        const resultado = await estadisticasService.getSolicitudesPorEstado(fechaInicio, fechaFin);
        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ Error en getSolicitudesPorEstado:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔹 Obtener el Top 10 de solicitudes recientes en un período
exports.getTop10Solicitudes = async (req, res) => {
    try {
        const { periodo } = req.query;
        console.log("📢 Periodo recibido:", periodo);

        const { fechaInicio, fechaFin } = getFechasPorPeriodo(periodo);
        console.log("📢 Fechas:", fechaInicio, " - ", fechaFin);

        const resultado = await estadisticasService.getTop10Solicitudes(fechaInicio, fechaFin);
        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ Error en getTop10Solicitudes:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
