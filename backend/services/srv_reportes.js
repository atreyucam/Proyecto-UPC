const { sequelize } = require("../config/database");

// nivel 1 - general
exports.obtenerResumenGeneral = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                COUNT(s.id_solicitud) AS total,
                COALESCE(SUM(CASE WHEN s.id_estado = 1 THEN 1 ELSE 0 END), 0) AS pendientes,
                COALESCE(SUM(CASE WHEN s.id_estado = 2 THEN 1 ELSE 0 END), 0) AS en_progreso,
                COALESCE(SUM(CASE WHEN s.id_estado = 3 THEN 1 ELSE 0 END), 0) AS resueltos
            FROM "Solicitud" s
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp;
        `;

        const [result] = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59` 
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return {
            totalSolicitudes: result.total || 0,
            solicitudesPorEstado: {
                pendientes: result.pendientes || 0,
                en_progreso: result.en_progreso || 0,
                resueltos: result.resueltos || 0
            }
        };
    } catch (error) {
        throw new Error("Error al obtener resumen general: " + error.message);
    }
};

// nivel 2 Solicitudes por tipo y subtipo
exports.obtenerSolicitudesPorTipo = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                ts.descripcion AS tipo,
                st.descripcion AS subtipo,
                COUNT(s.id_solicitud) AS total
            FROM "Solicitud" s
            JOIN "Subtipo" st ON s.id_subtipo = st.id_subtipo
            JOIN "TipoSolicitud" ts ON st.id_tipo = ts.id_tipo
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY ts.descripcion, st.descripcion
            ORDER BY ts.descripcion, total DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59` 
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return results;
    } catch (error) {
        throw new Error("Error al obtener solicitudes por tipo: " + error.message);
    }
};


exports.obtenerSolicitudesPorUbicacion = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                COALESCE(p.nombre_parroquia, 'Sin Parroquia') AS parroquia,
                COALESCE(c.nombre_canton, 'Sin Cantón') AS canton,
                COALESCE(d.nombre_distrito, 'Sin Distrito') AS distrito,
                COUNT(s.id_solicitud) AS total
            FROM "Solicitud" s
            LEFT JOIN "Parroquias" p ON s.id_parroquia = p.id_parroquia
            LEFT JOIN "Cantones" c ON p.id_canton = c.id_canton
            LEFT JOIN "Distritos" d ON p.id_distrito = d.id_distrito
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY p.nombre_parroquia, c.nombre_canton, d.nombre_distrito
            ORDER BY total DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return results;
    } catch (error) {
        throw new Error("Error al obtener solicitudes por ubicación: " + error.message);
    }
};


exports.obtenerTiempoResolucion = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                AVG(EXTRACT(EPOCH FROM (s.fecha_cierre - s.fecha_creacion)) / 3600) AS promedio_horas
            FROM "Solicitud" s
            WHERE s.id_estado = 3  -- Solo solicitudes resueltas
            AND s.fecha_cierre IS NOT NULL
            AND s.fecha_creacion BETWEEN :fechaInicio AND :fechaFin;
        `;

        const [result] = await sequelize.query(query, {
            replacements: { fechaInicio, fechaFin },
            type: sequelize.QueryTypes.SELECT,
        });

        return { tiempoPromedioResolucion: result.promedio_horas || 0 };
    } catch (error) {
        throw new Error("Error al obtener tiempo de resolución: " + error.message);
    }
};




// Nivel 5 - Informes de Desempeño Policial
exports.obtenerDesempenoPolicial = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                p.id_persona,
                p.nombres || ' ' || p.apellidos AS policia,
                COUNT(s.id_solicitud) AS total_asignadas,
                COUNT(CASE WHEN s.id_estado = 3 THEN 1 END) AS total_resueltas,
                COALESCE(AVG(EXTRACT(EPOCH FROM (s.fecha_cierre - s.fecha_creacion)) / 3600), 0) AS tiempo_promedio_resolucion,
                p.disponibilidad
            FROM "Persona" p
            LEFT JOIN "Solicitud" s ON p.id_persona = s.policia_asignado
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY p.id_persona, p.nombres, p.apellidos, p.disponibilidad
            ORDER BY total_asignadas DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return results;
    } catch (error) {
        throw new Error("Error al obtener desempeño policial: " + error.message);
    }
};


// Nivel 6 - Informes de Tipos de Emergencias y Delitos
exports.obtenerTiposEmergencias = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                ts.descripcion AS tipo,
                st.descripcion AS subtipo,
                COUNT(s.id_solicitud) AS total,
                EXTRACT(HOUR FROM s.fecha_creacion) AS hora
            FROM "Solicitud" s
            JOIN "Subtipo" st ON s.id_subtipo = st.id_subtipo
            JOIN "TipoSolicitud" ts ON st.id_tipo = ts.id_tipo
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY ts.descripcion, st.descripcion, hora
            ORDER BY total DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return results;
    } catch (error) {
        throw new Error("Error al obtener tipos de emergencias: " + error.message);
    }
};


// Nivel 7 - Informes de Ubicación Geográfica
exports.obtenerMapaIncidencias = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                s."puntoGPS" AS gps,
                ts.descripcion AS tipo,
                st.descripcion AS subtipo,
                COUNT(s.id_solicitud) AS total
            FROM "Solicitud" s
            JOIN "Subtipo" st ON s.id_subtipo = st.id_subtipo
            JOIN "TipoSolicitud" ts ON st.id_tipo = ts.id_tipo
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY s."puntoGPS", ts.descripcion, st.descripcion
            ORDER BY total DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return results;
    } catch (error) {
        throw new Error("Error al obtener mapa de incidencias: " + error.message);
    }
};

// servicios de reportes administrativos
// Nivel 8 - Informes Administrativos
exports.obtenerInformesAdministrativos = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            -- 📌 1. Cantidad de ciudadanos que han hecho reportes
            SELECT COUNT(DISTINCT s.creado_por) AS total_ciudadanos
            FROM "Solicitud" s
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp;
            
            -- 📌 2. Número de policías activos y sus asignaciones
            SELECT 
                COUNT(DISTINCT p.id_persona) AS total_policias, 
                SUM(CASE WHEN s.id_estado IN (2,3) THEN 1 ELSE 0 END) AS solicitudes_atendidas
            FROM "Persona" p
            LEFT JOIN "Solicitud" s ON p.id_persona = s.policia_asignado
            WHERE p.id_persona IN (SELECT id_persona FROM "PersonaRol" WHERE id_rol = 2); -- Rol de Policía
            
            -- 📌 3. Cantidad de reportes por rol administrativo
            SELECT 
                r.descripcion AS rol, 
                COUNT(s.id_solicitud) AS total_reportes
            FROM "Solicitud" s
            JOIN "Persona" p ON s.creado_por = p.id_persona
            JOIN "PersonaRol" pr ON p.id_persona = pr.id_persona
            JOIN "Rol" r ON pr.id_rol = r.id_rol
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY r.descripcion;
            
            -- 📌 4. Cantidad de reportes por usuario (ranking de actividad)
            SELECT 
                p.nombres || ' ' || p.apellidos AS usuario, 
                COUNT(s.id_solicitud) AS total_reportes
            FROM "Solicitud" s
            JOIN "Persona" p ON s.creado_por = p.id_persona
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY p.nombres, p.apellidos
            ORDER BY total_reportes DESC
            LIMIT 10; -- Top 10 usuarios más activos
        `;

        const results = await sequelize.query(query, {
            replacements: { 
                fechaInicio: `${fechaInicio} 00:00:00`, 
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
        });

        return {
            totalCiudadanos: results[0]?.total_ciudadanos || 0,
            policias: {
                total: results[1]?.total_policias || 0,
                solicitudesAtendidas: results[1]?.solicitudes_atendidas || 0
            },
            reportesPorRol: results[2] || [],
            rankingUsuariosActivos: results[3] || []
        };
    } catch (error) {
        throw new Error("Error al obtener informes administrativos: " + error.message);
    }
};


exports.obtenerReporteGeneralCompleto = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            -- 🟢 Resumen por estado
            SELECT 
                'Total' AS categoria,
                COUNT(*) FILTER (WHERE TRUE) AS total,
                COUNT(*) FILTER (WHERE s.id_estado = 1) AS pendientes,
                COUNT(*) FILTER (WHERE s.id_estado = 2) AS en_progreso,
                COUNT(*) FILTER (WHERE s.id_estado = 3) AS resueltos,
                COUNT(*) FILTER (WHERE s.id_estado = 4) AS cancelados
            FROM "Solicitud" s
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp;

            -- 🔵 Totales por tipo
            SELECT 
                ts.descripcion AS tipo,
                COUNT(s.id_solicitud) AS total
            FROM "Solicitud" s
            JOIN "Subtipo" st ON s.id_subtipo = st.id_subtipo
            JOIN "TipoSolicitud" ts ON st.id_tipo = ts.id_tipo
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY ts.descripcion
            ORDER BY total DESC;

            -- 🟣 Totales por subtipo
            SELECT 
                st.descripcion AS subtipo,
                COUNT(s.id_solicitud) AS total
            FROM "Solicitud" s
            JOIN "Subtipo" st ON s.id_subtipo = st.id_subtipo
            WHERE s.fecha_creacion BETWEEN :fechaInicio::timestamp AND :fechaFin::timestamp
            GROUP BY st.descripcion
            ORDER BY total DESC;
        `;

        const results = await sequelize.query(query, {
            replacements: {
                fechaInicio: `${fechaInicio} 00:00:00`,
                fechaFin: `${fechaFin} 23:59:59`
            },
            type: sequelize.QueryTypes.SELECT,
            raw: true,
            plain: false
        });

        // Separa resultados por grupos (los SELECT llegan como array plano)
        const resumen = results[0];
        const tipos = results.slice(1).filter(r => r.tipo);
        const subtipos = results.slice(1).filter(r => r.subtipo);

        return {
            resumen,
            tipos,
            subtipos
        };
    } catch (error) {
        throw new Error("Error en obtenerReporteGeneralCompleto: " + error.message);
    }
};
