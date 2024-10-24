const { Op, fn, col, literal, where, Sequelize } = require("sequelize");
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

// **Función para obtener contadores de policías funciona
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

// ** filtros

// exports.getSolicitudesFiltradas2 = async (filtros) => {
//     const { anio, rangoMesInicio, rangoMesFin } = filtros;

//     const whereConditions = {};

//     if (anio) {
//         whereConditions[Op.and] = where(
//             literal('EXTRACT(YEAR FROM "fecha_creacion")'),
//             anio
//         );
//     }

//     if (rangoMesInicio && rangoMesFin) {
//         whereConditions[Op.and] = where(
//             literal('EXTRACT(MONTH FROM "fecha_creacion")'),
//             { [Op.between]: [rangoMesInicio, rangoMesFin] }
//         );
//     }

//     try {
//         const solicitudes = await Solicitud.findAll({
//             attributes: [
//                 [literal('EXTRACT(MONTH FROM "fecha_creacion")'), "mes"],
//                 [
//                     fn("COUNT", col("Solicitud.id_solicitud")),
//                     "total_solicitudes",
//                 ],
//                 [col("Subtipo.descripcion"), "subtipo_descripcion"],
//                 [col("Subtipo->TipoSolicitud.descripcion"), "tipo_descripcion"],
//                 [col("Subtipo->TipoSolicitud.id_tipo"), "tipo_id"],
//             ],
//             include: [
//                 {
//                     model: Subtipo,
//                     attributes: [],
//                     include: [{ model: TipoSolicitud, attributes: [] }],
//                 },
//             ],
//             where: whereConditions,
//             group: [
//                 literal('EXTRACT(MONTH FROM "fecha_creacion")'),
//                 "Subtipo.descripcion",
//                 "Subtipo->TipoSolicitud.descripcion",
//                 "Subtipo->TipoSolicitud.id_tipo",
//             ],
//             raw: true,
//         });

//         const calculosPorTipo = calcularFrecuenciasYVariaciones(
//             solicitudes,
//             rangoMesInicio,
//             rangoMesFin
//         );

//         return { solicitudes, calculosPorTipo };
//     } catch (error) {
//         console.error("Error al obtener las solicitudes filtradas:", error);
//         throw new Error("Error al obtener las solicitudes filtradas");
//     }
// };

// // Función para calcular frecuencias y variaciones por tipo
// const calcularFrecuenciasYVariaciones = (solicitudes, mesInicio, mesFin) => {
//     const agrupadoPorTipo = solicitudes.reduce((acc, item) => {
//         const tipo = item.tipo_descripcion;
//         if (!acc[tipo]) {
//             acc[tipo] = { subtipos: {}, totalInicio: 0, totalFin: 0 };
//         }
//         const mes = parseInt(item.mes);

//         if (mes === mesInicio) {
//             acc[tipo].totalInicio += parseInt(item.total_solicitudes);
//         } else if (mes === mesFin) {
//             acc[tipo].totalFin += parseInt(item.total_solicitudes);
//         }

//         if (!acc[tipo].subtipos[item.subtipo_descripcion]) {
//             acc[tipo].subtipos[item.subtipo_descripcion] = {
//                 inicio: 0,
//                 fin: 0,
//             };
//         }

//         if (mes === mesInicio) {
//             acc[tipo].subtipos[item.subtipo_descripcion].inicio += parseInt(
//                 item.total_solicitudes
//             );
//         } else if (mes === mesFin) {
//             acc[tipo].subtipos[item.subtipo_descripcion].fin += parseInt(
//                 item.total_solicitudes
//             );
//         }

//         return acc;
//     }, {});

//     // Calcular incremento/decremento
//     return Object.entries(agrupadoPorTipo).map(
//         ([tipo, { subtipos, totalInicio, totalFin }]) => {
//             const variacion =
//                 ((totalFin - totalInicio) / (totalInicio || 1)) * 100;

//             return {
//                 tipo,
//                 subtipos: Object.entries(subtipos).map(([subtipo, data]) => ({
//                     subtipo,
//                     inicio: data.inicio,
//                     fin: data.fin,
//                     variacion:
//                         ((data.fin - data.inicio) / (data.inicio || 1)) * 100,
//                 })),
//                 totalInicio,
//                 totalFin,
//                 variacion,
//             };
//         }
//     );
// };
exports.getSolicitudesFiltradas2 = async (filtros) => {
    const { anio, rangoMesInicio, rangoMesFin } = filtros;

    const whereConditions = {};

    if (anio) {
        whereConditions[Op.and] = [
            Sequelize.where(
                Sequelize.fn(
                    "EXTRACT",
                    Sequelize.literal('YEAR FROM "fecha_creacion"')
                ),
                anio
            ),
        ];
    }

    if (rangoMesInicio && rangoMesFin) {
        whereConditions[Op.and].push(
            Sequelize.where(
                Sequelize.fn(
                    "EXTRACT",
                    Sequelize.literal('MONTH FROM "fecha_creacion"')
                ),
                { [Op.between]: [rangoMesInicio, rangoMesFin] }
            )
        );
    }

    const homicidiosIntencionales = [
        "Asesinato",
        "Femicidio",
        "Homicidio",
        "Sicariato",
    ];

    try {
        const solicitudes = await Solicitud.findAll({
            attributes: [
                [literal('EXTRACT(MONTH FROM "fecha_creacion")'), "mes"],
                [
                    fn("COUNT", col("Solicitud.id_solicitud")),
                    "total_solicitudes",
                ],
                [col("Subtipo.descripcion"), "subtipo_descripcion"],
                [col("Subtipo->TipoSolicitud.descripcion"), "tipo_descripcion"],
                [col("Subtipo->TipoSolicitud.id_tipo"), "tipo_id"],
            ],
            include: [
                {
                    model: Subtipo,
                    attributes: [],
                    include: [{ model: TipoSolicitud, attributes: [] }],
                },
            ],
            where: { [Op.and]: whereConditions },
            group: [
                literal('EXTRACT(MONTH FROM "fecha_creacion")'),
                "Subtipo.descripcion",
                "Subtipo->TipoSolicitud.descripcion",
                "Subtipo->TipoSolicitud.id_tipo",
            ],
            raw: true,
        });

        console.log("Solicitudes recuperadas:", solicitudes); // Verificar resultados completos.

        const homicidios = solicitudes.filter((s) =>
            homicidiosIntencionales.includes(s.subtipo_descripcion)
        );

        const restantes = solicitudes.filter(
            (s) => !homicidiosIntencionales.includes(s.subtipo_descripcion)
        );

        const calculosPorTipo = calcularFrecuenciasYVariaciones(
            restantes,
            rangoMesInicio,
            rangoMesFin
        );

        const calculoHomicidios = {
            tipo: "Homicidios Intencionales",
            subtipos: homicidios.map((h) => ({
                subtipo: h.subtipo_descripcion,
                inicio: parseInt(h.total_solicitudes, 10) || 0,
                fin: parseInt(h.total_solicitudes, 10) || 0,
                variacion: calcularVariacion(
                    parseInt(h.total_solicitudes, 10) || 0,
                    parseInt(h.total_solicitudes, 10) || 0
                ),
            })),
            totalInicio: homicidios.reduce(
                (acc, h) => acc + parseInt(h.total_solicitudes, 10) || 0,
                0
            ),
            totalFin: homicidios.reduce(
                (acc, h) => acc + parseInt(h.total_solicitudes, 10) || 0,
                0
            ),
            variacion: calcularVariacion(
                homicidios.reduce(
                    (acc, h) => acc + parseInt(h.total_solicitudes, 10) || 0,
                    0
                ),
                homicidios.reduce(
                    (acc, h) => acc + parseInt(h.total_solicitudes, 10) || 0,
                    0
                )
            ),
        };

        calculosPorTipo.push(calculoHomicidios);
        // console.log("Solicitudes recuperadas desde la BD:", solicitudes);
        // console.log("Condiciones de filtro:", whereConditions);
        // console.log("Solicitudes para respuesta:", solicitudes);

        return { solicitudes, calculosPorTipo };
    } catch (error) {
        console.error("Error al obtener las solicitudes filtradas:", error);
        throw new Error("Error al obtener las solicitudes filtradas");
    }
};

// const calcularVariacion = (inicio, fin) => {
//     inicio = inicio || 0; // Aseguramos que sea al menos 0
//     fin = fin || 0;
//     if (inicio === 0 && fin === 0) return 0; // Sin datos
//     if (inicio === fin) return 0; // Muestra un mensaje en lugar de 0%
//     if (inicio === 0) return 100; // Si el inicio es 0 y hay valor en fin
//     const variacion = ((fin - inicio) / inicio) * 100;
//     return isNaN(variacion) ? 0 : variacion;
// };
const calcularVariacion = (inicio, fin) => {
    if (inicio === 0 && fin === 0) return 0; // Sin datos
    if (inicio === fin) return 0; // Sin variación
    if (inicio === 0) return 100; // Inicio en 0, pero hay datos en fin

    return ((fin - inicio) / inicio) * 100;
};
const calcularFrecuenciasYVariaciones = (solicitudes, mesInicio, mesFin) => {
    const tipos = [...new Set(solicitudes.map((s) => s.tipo_descripcion))];

    // Generamos los meses disponibles en el rango solicitado
    const mesesDisponibles = Array.from(
        { length: mesFin - mesInicio + 1 },
        (_, i) => mesInicio + i
    );

    return tipos.map((tipo) => {
        const solicitudesPorTipo = solicitudes.filter(
            (s) => s.tipo_descripcion === tipo
        );

        const subtipos = [
            ...new Set(solicitudesPorTipo.map((s) => s.subtipo_descripcion)),
        ];

        const subtipoData = subtipos.map((subtipo) => {
            // Obtener las solicitudes del subtipo en el mes de inicio o retornar 0 si no hay datos
            const inicio = solicitudesPorTipo
                .filter(
                    (s) =>
                        s.subtipo_descripcion === subtipo &&
                        parseInt(s.mes) === mesInicio
                )
                .reduce((acc, s) => acc + parseInt(s.total_solicitudes, 10), 0);

            // Obtener las solicitudes del subtipo en el mes de fin o retornar 0 si no hay datos
            const fin = solicitudesPorTipo
                .filter(
                    (s) =>
                        s.subtipo_descripcion === subtipo &&
                        parseInt(s.mes) === mesFin
                )
                .reduce((acc, s) => acc + parseInt(s.total_solicitudes, 10), 0);

            const variacion = calcularVariacion(inicio, fin);

            return { subtipo, inicio, fin, variacion };
        });

        const totalInicio = subtipoData.reduce((acc, s) => acc + s.inicio, 0);
        const totalFin = subtipoData.reduce((acc, s) => acc + s.fin, 0);
        const variacion = calcularVariacion(totalInicio, totalFin);

        return {
            tipo,
            subtipos: subtipoData,
            totalInicio,
            totalFin,
            variacion,
        };
    });
};

// Función para calcular la variación porcentual
// const calcularVariacion = (inicio, fin) => {
//     if (inicio === 0 && fin === 0) return 0;
//     if (inicio === 0) return 100;
//     return ((fin - inicio) / inicio) * 100;
// };
//

// filtro de tablas
exports.getSubtiposPorTipoTablas = async (filtros) => {
    const { anio, rangoMesInicio, rangoMesFin } = filtros;

    const whereConditions = {};
    if (anio) {
        whereConditions[Op.and] = literal(
            `EXTRACT(YEAR FROM "fecha_creacion") = ${anio}`
        );
    }
    if (rangoMesInicio && rangoMesFin) {
        whereConditions[Op.and] = literal(
            `EXTRACT(MONTH FROM "fecha_creacion") BETWEEN ${rangoMesInicio} AND ${rangoMesFin}`
        );
    }

    try {
        const resultados = await Solicitud.findAll({
            attributes: [
                [col("Subtipo.descripcion"), "subtipo"],
                [col("Subtipo->TipoSolicitud.descripcion"), "tipo"],
                [fn("COUNT", col("Solicitud.id_solicitud")), "frecuencia"],
            ],
            include: [
                {
                    model: Subtipo,
                    include: [{ model: TipoSolicitud }],
                },
            ],
            where: whereConditions,
            group: [
                "Subtipo.descripcion",
                "Subtipo->TipoSolicitud.descripcion",
            ],
            raw: true,
        });

        return resultados;
    } catch (error) {
        console.error("Error al obtener los subtipos:", error);
        throw new Error("Error al obtener los subtipos por tipo.");
    }
};
