const { Op, fn, col, literal, where } = require("sequelize");
const {
    Persona,
    Rol,
    PersonaRol,
    Circuito,
    sequelize,
    Solicitud,
    Estado,
    Subtipo,
    TipoSolicitud,
} = require("../../models/db_models");

// Datos para estadisticas

// Función para obtener contadores de policías
exports.getPoliciaCounts = async () => {
    try {
        // Obtener la cantidad total de policías
        const totalPolicias = await Persona.count({
            include: [
                {
                    model: Rol,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                    where: { id_rol: 3 },
                },
            ],
        });

        // Obtener la cantidad de policías disponibles
        const disponibles = await Persona.count({
            include: [
                {
                    model: Rol,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                    where: { id_rol: 3 },
                },
            ],
            where: {
                disponibilidad: "Disponible",
            },
        });

        // Obtener la cantidad de policías ocupados
        const ocupados = await Persona.count({
            include: [
                {
                    model: Rol,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                    where: { id_rol: 3 },
                },
            ],
            where: {
                disponibilidad: "Ocupado",
            },
        });

        return {
            total: totalPolicias,
            disponibles: disponibles,
            ocupados: ocupados,
        };
    } catch (error) {
        console.error("Error en getPoliciaCounts:", error.message);
        throw new Error("Error al obtener los contadores de policías");
    }
};

const mesesInglesToEspanol = {
    January: "Enero",
    February: "Febrero",
    March: "Marzo",
    April: "Abril",
    May: "Mayo",
    June: "Junio",
    July: "Julio",
    August: "Agosto",
    September: "Septiembre",
    October: "Octubre",
    November: "Noviembre",
    December: "Diciembre",
};

exports.getContadorSolicitudesTotal = async () => {
    try {
        const totalSolicitudes = await Solicitud.count();

        const countsByTypeAndMonth = await Solicitud.findAll({
            attributes: [
                [sequelize.col("Subtipo.id_tipo"), "id_tipo"],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("Solicitud.id_solicitud")
                    ),
                    "count",
                ],
                [
                    sequelize.col("Subtipo->TipoSolicitud.descripcion"),
                    "tipo_descripcion",
                ],
                [
                    sequelize.fn(
                        "TO_CHAR",
                        sequelize.col("Solicitud.fecha_creacion"),
                        "Month"
                    ),
                    "mes",
                ],
                [
                    sequelize.fn(
                        "EXTRACT",
                        sequelize.literal("MONTH FROM Solicitud.fecha_creacion")
                    ),
                    "mes_numero",
                ],
            ],
            include: [
                {
                    model: Subtipo,
                    attributes: [],
                    include: [{ model: TipoSolicitud, attributes: [] }],
                },
            ],
            group: [
                "mes",
                "mes_numero",
                "Subtipo.id_tipo",
                "Subtipo->TipoSolicitud.descripcion",
            ],
            order: [[sequelize.literal("mes_numero"), "ASC"]],
            raw: true,
        });

        // Transformar los nombres de los meses de inglés a español
        const datosPorMes = countsByTypeAndMonth.reduce((acc, item) => {
            const mesEnEspanol =
                mesesInglesToEspanol[item.mes.trim()] || item.mes.trim(); // Traducción o valor por defecto
            if (!acc[mesEnEspanol]) acc[mesEnEspanol] = [];
            acc[mesEnEspanol].push({
                id_tipo: item.id_tipo,
                tipo_descripcion: item.tipo_descripcion,
                count: parseInt(item.count, 10),
            });
            return acc;
        }, {});

        const countsByStatus = await Solicitud.findAll({
            attributes: [
                [sequelize.col("Estado.descripcion"), "estado_descripcion"],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("Solicitud.id_solicitud")
                    ),
                    "count",
                ],
            ],
            include: [{ model: Estado, attributes: [] }],
            group: ["Estado.descripcion"],
            raw: true,
        });

        const countsByStatusMap = countsByStatus.reduce((acc, status) => {
            acc[status.estado_descripcion] = parseInt(status.count, 10);
            return acc;
        }, {});

        return {
            total: {
                label: "Solicitudes registradas",
                count: totalSolicitudes,
            },
            byStatus: {
                title: "Por tipos de solicitud",
                counts: {
                    "Solicitudes pendientes":
                        countsByStatusMap["Pendiente"] || 0,
                    "Solicitudes en Progreso":
                        countsByStatusMap["En progreso"] || 0,
                    "Solicitudes resueltas": countsByStatusMap["Resuelto"] || 0,
                    "Solicitudes falsas": countsByStatusMap["Falso"] || 0,
                },
            },
            porMes: datosPorMes,
        };
    } catch (error) {
        console.error(
            "Error al obtener el conteo por tipo de solicitud:",
            error
        );
        throw error;
    }
};

exports.getContadorSolicitudesTotal = async () => {
    try {
        const totalSolicitudes = await Solicitud.count();

        const countsByTypeAndMonth = await Solicitud.findAll({
            attributes: [
                [sequelize.col("Subtipo.id_tipo"), "id_tipo"],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("Solicitud.id_solicitud")
                    ),
                    "count",
                ],
                [
                    sequelize.col("Subtipo->TipoSolicitud.descripcion"),
                    "tipo_descripcion",
                ],
                [
                    sequelize.fn(
                        "TO_CHAR",
                        sequelize.col("Solicitud.fecha_creacion"),
                        "TMMonth"
                    ),
                    "mes",
                ],
                [
                    sequelize.literal(
                        'EXTRACT(MONTH FROM "Solicitud"."fecha_creacion")'
                    ),
                    "mes_numero",
                ],
            ],
            include: [
                {
                    model: Subtipo,
                    attributes: [],
                    include: [{ model: TipoSolicitud, attributes: [] }],
                },
            ],
            group: [
                "mes",
                "mes_numero",
                "Subtipo.id_tipo",
                "Subtipo->TipoSolicitud.descripcion",
            ],
            order: [[sequelize.literal('"mes_numero"'), "ASC"]],
            raw: true,
        });

        // Transformar los nombres de los meses de inglés a español
        const datosPorMes = countsByTypeAndMonth.reduce((acc, item) => {
            const mesEnEspanol =
                mesesInglesToEspanol[item.mes.trim()] || item.mes.trim(); // Traducción o valor por defecto
            if (!acc[mesEnEspanol]) acc[mesEnEspanol] = [];
            acc[mesEnEspanol].push({
                id_tipo: item.id_tipo,
                tipo_descripcion: item.tipo_descripcion,
                count: parseInt(item.count, 10),
            });
            return acc;
        }, {});

        const countsByStatus = await Solicitud.findAll({
            attributes: [
                [sequelize.col("Estado.descripcion"), "estado_descripcion"],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("Solicitud.id_solicitud")
                    ),
                    "count",
                ],
            ],
            include: [{ model: Estado, attributes: [] }],
            group: ["Estado.descripcion"],
            raw: true,
        });

        const countsByStatusMap = countsByStatus.reduce((acc, status) => {
            acc[status.estado_descripcion] = parseInt(status.count, 10);
            return acc;
        }, {});

        return {
            total: {
                label: "Solicitudes registradas",
                count: totalSolicitudes,
            },
            byStatus: {
                title: "Por tipos de solicitud",
                counts: {
                    "Solicitudes pendientes":
                        countsByStatusMap["Pendiente"] || 0,
                    "Solicitudes en Progreso":
                        countsByStatusMap["En progreso"] || 0,
                    "Solicitudes resueltas": countsByStatusMap["Resuelto"] || 0,
                    "Solicitudes falsas": countsByStatusMap["Falso"] || 0,
                },
            },
            porMes: datosPorMes,
        };
    } catch (error) {
        console.error(
            "Error al obtener el conteo por tipo de solicitud:",
            error
        );
        throw error;
    }
};

// =============================================================================

exports.getContadorSolicitudesPorTipo = async () => {
    try {
        const countsByType = await Solicitud.findAll({
            attributes: [
                [sequelize.col("Subtipo.id_tipo"), "id_tipo"],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("Solicitud.id_solicitud")
                    ),
                    "count",
                ],
                [
                    sequelize.col("Subtipo->TipoSolicitud.descripcion"),
                    "tipo_descripcion",
                ],
            ],
            include: [
                {
                    model: Subtipo,
                    attributes: [],
                    include: [{ model: TipoSolicitud, attributes: [] }],
                },
            ],
            group: ["Subtipo.id_tipo", "Subtipo->TipoSolicitud.descripcion"],
            raw: true,
        });

        const result = countsByType.map((item) => ({
            id_tipo: item.id_tipo,
            tipo_descripcion: item.tipo_descripcion,
            count: parseInt(item.count, 10),
        }));

        return result;
    } catch (error) {
        console.error(
            "Error al obtener el conteo de solicitudes por tipo:",
            error
        );
        throw error;
    }
};

// filtros para reportes

// Obtener solicitudes filtradas según criterios
exports.getSolicitudesFiltradas = async (filtros) => {
    const { anio, mes, rangoMesInicio, rangoMesFin, tipo, subtipo } = filtros;

    const whereConditions = { [Op.and]: [] };

    // Filtro por año usando EXTRACT en PostgreSQL
    if (anio) {
        whereConditions[Op.and].push(
            literal(`EXTRACT(YEAR FROM "fecha_creacion") = ${anio}`)
        );
    }

    // Filtro por mes específico usando EXTRACT
    if (mes) {
        whereConditions[Op.and].push(
            literal(`EXTRACT(MONTH FROM "fecha_creacion") = ${mes}`)
        );
    }

    // Filtro por rango de meses usando EXTRACT
    if (rangoMesInicio && rangoMesFin) {
        whereConditions[Op.and].push(
            literal(
                `EXTRACT(MONTH FROM "fecha_creacion") BETWEEN ${rangoMesInicio} AND ${rangoMesFin}`
            )
        );
    }

    // Filtro por tipo de solicitud
    if (tipo) {
        whereConditions["$Subtipo.TipoSolicitud.descripcion$"] = tipo;
    }

    // Filtro por subtipo de solicitud
    if (subtipo) {
        whereConditions["$Subtipo.descripcion$"] = subtipo;
    }

    try {
        const solicitudes = await Solicitud.findAll({
            where:
                whereConditions[Op.and].length > 0
                    ? whereConditions
                    : undefined,
            include: [
                {
                    model: Subtipo,
                    include: [{ model: TipoSolicitud }],
                },
            ],
            order: [["fecha_creacion", "DESC"]],
        });

        return solicitudes;
    } catch (error) {
        console.error("Error al obtener las solicitudes filtradas:", error);
        throw new Error("Error al obtener las solicitudes filtradas");
    }
};

// nuevo
// Servicio para obtener el resumen de solicitudes agrupadas por mes y tipo
exports.getResumenSolicitudes = async (anioFiltro) => {
    try {
        // Determinar el año a usar (por defecto, año actual)
        const anio = anioFiltro || new Date().getFullYear();

        // Obtener solicitudes por mes
        const solicitudesPorMes = await Solicitud.findAll({
            attributes: [
                [literal(`EXTRACT(MONTH FROM "fecha_creacion")`), "mes"],
                [
                    Sequelize.fn("COUNT", Sequelize.col("id_solicitud")),
                    "cantidad",
                ],
            ],
            where: literal(`EXTRACT(YEAR FROM "fecha_creacion") = ${anio}`),
            group: ["mes"],
            order: [[literal("mes"), "ASC"]],
        });

        // Obtener solicitudes por tipo agrupadas por mes
        const solicitudesPorTipo = await Solicitud.findAll({
            attributes: [
                [literal(`EXTRACT(MONTH FROM "fecha_creacion")`), "mes"],
                [Sequelize.col("Subtipo.TipoSolicitud.descripcion"), "tipo"],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.col("Solicitud.id_solicitud")
                    ),
                    "cantidad",
                ],
            ],
            include: [
                {
                    model: Subtipo,
                    include: [{ model: TipoSolicitud }],
                },
            ],
            where: literal(`EXTRACT(YEAR FROM "fecha_creacion") = ${anio}`),
            group: ["mes", "tipo"],
            order: [[literal("mes"), "ASC"]],
        });

        return { solicitudesPorMes, solicitudesPorTipo };
    } catch (error) {
        console.error("Error al obtener el resumen de solicitudes:", error);
        throw new Error("Error al obtener el resumen de solicitudes");
    }
};
