const {Solicitud, SolicitudEventoPersona, Subtipo, Persona, sequelize, TipoSolicitud,
    Circuito,Observacion, Estado, Evento, Rol, SolicitudEvidencia, TipoEvidencia,
    Distrito, Canton, Subzona, Parroquia } = require("../models/db_models");
    const { Op } = require("sequelize");

const { notificarUsuarios, notificarUsuariosPorRol } = require("./srv_notificacion");
const { getPoliciaCounts } = require("./srv_estadisticas");


exports.getSolicitudes = async () => {
    try {
        const solicitudes = await Solicitud.findAll({
            include: [
                {
                    model: Persona,
                    as: "creador",
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Persona,
                    as: "policia",
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ["descripcion"],
                            as: "TipoSolicitud",
                        },
                    ],
                    attributes: ["descripcion"],
                    as: "Subtipo",
                },
                {
                    model: Estado,
                    attributes: ["descripcion"],
                    as: "Estado",
                },
                {
                    model: Circuito,
                    attributes: ["nombre_circuito"],
                    as: "Circuito",
                    include: [
                        {
                            model: Parroquia,
                            attributes: ["nombre_parroquia"],
                            as: "Parroquium", // Asegúrate de que el alias sea correcto
                            include: [
                                {
                                    model: Canton,
                                    attributes: ["nombre_canton"],
                                    as: "Canton", // Verificar si 'Canton' es el alias correcto
                                    include: [
                                        {
                                            model: Subzona,
                                            attributes: ["nombre_subzona"],
                                            as: "Subzona", // Asegúrate de que el alias sea correcto
                                        },
                                    ],
                                },
                                {
                                    model: Distrito,
                                    attributes: ["nombre_distrito"],
                                    as: "Distrito", // Asegúrate de que el alias sea correcto
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["fecha_creacion", "DESC"]],
        });

        const solicitudesEstructuradas = solicitudes.map((solicitud) => {
            const circuito = solicitud.Circuito;
            const parroquia = circuito?.Parroquium; // Usa el alias correcto
            const canton = parroquia?.Canton; // Usa el alias correcto
            const subzona = canton?.Subzona;
            const distrito = circuito?.Distrito;

            return {
                id_solicitud: solicitud.id_solicitud,
                estado: solicitud.Estado.descripcion,
                tipo: solicitud.Subtipo.TipoSolicitud.descripcion,
                subtipo: solicitud.Subtipo.descripcion,
                creado_por: `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`,
                policia_asignado: solicitud.policia
                    ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}`
                    : "No asignado",
                puntoGPS: solicitud.puntoGPS,
                ubicacion: {
                    subzona: subzona?.nombre_subzona || "Sin Subzona",
                    canton: canton?.nombre_canton || "Sin Cantón",
                    distrito: distrito?.nombre_distrito || "Sin Distrito",
                },
                fecha_creacion: solicitud.fecha_creacion.toISOString(),
            };
        });

        return solicitudesEstructuradas;
    } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        throw new Error("Error al obtener las solicitudes: " + error.message);
    }
};

exports.getSolicitudById = async (id_solicitud) => {
    try {
        // Obtener la solicitud con toda la información asociada
        const solicitud = await Solicitud.findByPk(id_solicitud, {
            include: [
                {
                    model: Persona,
                    as: "creador",
                    attributes: ["id_persona", "nombres", "apellidos"],
                },
                {
                    model: Persona,
                    as: "policia",
                    attributes: ["id_persona", "nombres", "apellidos"],
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ["descripcion"], // Incluir la descripción del tipo de solicitud
                        },
                    ],
                    attributes: ["descripcion"],
                },
                {
                    model: Estado,
                    attributes: ["descripcion"],
                },
                {
                    model: Circuito,
                    include: [
                        {
                            model: Parroquia,
                            attributes: ["nombre_parroquia"],
                            as: "Parroquium", // Asegúrate de usar el alias correcto si lo defines así en tu ORM
                            include: [
                                {
                                    model: Distrito,
                                    attributes: ["nombre_distrito"],
                                    as: "Distrito", // Ajustar si se usa un alias diferente en ORM
                                    include: [
                                        {
                                            model: Canton,
                                            attributes: ["nombre_canton"],
                                            as: "cantones", // Usar alias 'cantones' si es definido así
                                            include: [
                                                {
                                                    model: Subzona,
                                                    attributes: [
                                                        "nombre_subzona",
                                                    ],
                                                    as: "Subzona", // Asegúrate de usar el alias correcto
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    as: "Circuito", // Usar el alias definido en ORM
                },
                {
                    model: SolicitudEventoPersona,
                    include: [
                        {
                            model: Evento,
                            attributes: ["evento"], // Solo la descripción del evento
                        },
                        {
                            model: Persona,
                            attributes: ["id_persona", "nombres", "apellidos"],
                        },
                    ],
                    attributes: ["fecha_creacion"],
                    order: [["fecha_creacion", "ASC"]],
                },
                {
                    model: Observacion,
                    include: [
                        {
                            model: Persona,
                            attributes: ["id_persona", "nombres", "apellidos"],
                        },
                    ],
                    attributes: ["observacion", "fecha"],
                    order: [["fecha", "ASC"]],
                },
                {
                    model: SolicitudEvidencia,
                    include: [
                        {
                            model: TipoEvidencia,
                            attributes: ["evidencia"], // Incluir el tipo de evidencia (imagen, video, audio)
                        },
                    ],
                    attributes: ["evidencia"], // Nombre del archivo de la evidencia
                },
            ],
        });

        if (!solicitud) {
            throw new Error("La solicitud especificada no existe.");
        }

        // Mapear la solicitud para estructurar la respuesta
        const circuito = solicitud.Circuito;
        const parroquia = circuito?.Parroquium; // Asegúrate de usar el alias correcto
        const distrito = parroquia?.Distrito; // Ajustar si se usa un alias diferente
        const canton = distrito?.cantones?.[0]; // Acceder al primer cantón del distrito si es una relación muchos a muchos
        const subzona = canton?.Subzona;

        const formattedSolicitud = {
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado.descripcion,
            tipo: solicitud.Subtipo.TipoSolicitud.descripcion,
            subtipo: solicitud.Subtipo.descripcion,
            fecha_creacion: solicitud.fecha_creacion,
            fecha_cierre: solicitud.fecha_cierre ?? "No cerrada",  // ✅ NUEVA LÍNEA
            puntoGPS: solicitud.puntoGPS,
            direccion: solicitud.direccion,
            ubicacion: {
                distrito: distrito?.nombre_distrito || "Sin Distrito",
                canton: canton?.nombre_canton || "Sin Cantón",
                subzona: subzona?.nombre_subzona || "Sin Subzona",
            },
            creado_por: solicitud.creador,
            policia_asignado: solicitud.policia,
            SolicitudEventoPersonas: solicitud.SolicitudEventoPersonas.map(
                (sep) => ({
                    id_evento: sep.Evento.evento,
                    fecha_creacion: sep.fecha_creacion,
                    persona: sep.Persona,
                })
            ),
            Observacions: solicitud.Observacions.map((obs) => ({
                observacion: obs.observacion,
                fecha: obs.fecha,
                persona: obs.Persona,
            })),
            evidencias: solicitud.SolicitudEvidencia.map((evidencia) => ({
                tipo: evidencia.TipoEvidencia.evidencia,
                url: `https://onedrive-link/${evidencia.evidencia}`,
            })),
        };

        return formattedSolicitud;
    } catch (error) {
        throw new Error("Error al obtener la solicitud: " + error.message);
    }
};

// * Funcional
exports.getSolicitudesPendientes = async () => {
    try {
        const solicitudesPendientes = await Solicitud.findAll({
            include: [
                {
                    model: Persona,
                    as: "creador", // 👈 Relación correcta para el creador
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Persona,
                    as: "policia", // 👈 Relación correcta para el policía asignado
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ["descripcion"],
                        },
                    ],
                    attributes: ["descripcion"],
                },
                {
                    model: Estado,
                    attributes: ["descripcion"],
                },
                {
                    model: Circuito,
                    attributes: ["nombre_circuito"],
                    include: [
                        {
                            model: Parroquia,
                            attributes: ["nombre_parroquia"],
                            include: [
                                {
                                    model: Distrito,
                                    attributes: ["nombre_distrito"],
                                    include: [
                                        {
                                            model: Canton,
                                            attributes: ["nombre_canton"],
                                            as: "cantones", // 👈 Alias correcto
                                            include: [
                                                {
                                                    model: Subzona,
                                                    attributes: ["nombre_subzona"],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            where: {
                "$Estado.descripcion$": "pendiente", // Filtrar por estado "Pendiente"
            },
            order: [["fecha_creacion", "DESC"]],
        });

        // ✅ Mapear los datos con accesos correctos
        return solicitudesPendientes.map((solicitud) => ({
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado?.descripcion || "Desconocido",
            tipo: solicitud.Subtipo?.TipoSolicitud?.descripcion || "Desconocido",
            subtipo: solicitud.Subtipo?.descripcion || "Desconocido",
            creado_por: solicitud.creador
                ? `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`
                : "No registrado",
            policia_asignado: solicitud.policia
                ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}`
                : "No asignado",
            puntoGPS: solicitud.puntoGPS || "No disponible",
            ubicacion: {
                distrito:
                    solicitud.Circuito?.Parroquia?.Distrito?.nombre_distrito ||
                    "Sin Distrito",
                canton:
                    solicitud.Circuito?.Parroquia?.Distrito?.cantones?.[0]
                        ?.nombre_canton || "Sin Cantón",
                subzona:
                    solicitud.Circuito?.Parroquia?.Distrito?.cantones?.[0]
                        ?.Subzona?.nombre_subzona || "Sin Subzona",
            },
            fecha_creacion: solicitud.fecha_creacion
                ? solicitud.fecha_creacion.toISOString()
                : "Fecha no disponible",
        }));
    } catch (error) {
        throw new Error(
            "Error al obtener las solicitudes pendientes: " + error.message
        );
    }
};

exports.top10SolicitudesRecientes = async () => {
    try {
        // Obtener todas las solicitudes con información asociada, ordenadas por fecha de creación ascendente
        const solicitudes = await Solicitud.findAll({
            include: [
                {
                    model: Persona,
                    as: "creador",
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Persona,
                    as: "policia",
                    attributes: ["nombres", "apellidos"],
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ["descripcion"], // Asegúrate de incluir la descripción del tipo de solicitud
                        },
                    ],
                    attributes: ["descripcion"],
                },
                {
                    model: Estado,
                    attributes: ["descripcion"],
                },
                {
                    model: Circuito,
                    include: [
                        {
                            model: Parroquia,
                            attributes: ["nombre_parroquia"],
                            include: [
                                {
                                    model: Distrito,
                                    attributes: ["nombre_distrito"],
                                    include: [
                                        {
                                            model: Canton,
                                            as: "cantones",
                                            attributes: ["nombre_canton"],
                                            include: [
                                                {
                                                    model: Subzona,
                                                    attributes: [
                                                        "nombre_subzona",
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["fecha_creacion", "DESC"]], // Ordenar por fecha_creacion descendente
            limit: 5, // Limitar los resultados a los 10 más recientes
        });

        // Mapear las solicitudes para estructurar la respuesta
        const solicitudesEstructuradas = solicitudes.map((solicitud) => {
            const circuito = solicitud.Circuito;
            const parroquia = circuito?.Parroquia;
            const distrito = parroquia?.Distrito;
            const canton = distrito?.Canton;
            const subzona = canton?.Subzona;

            return {
                id_solicitud: solicitud.id_solicitud,
                estado: solicitud.Estado.descripcion,
                tipo: solicitud.Subtipo.TipoSolicitud.descripcion, // Agregar tipo de solicitud
                subtipo: solicitud.Subtipo.descripcion, // Agregar subtipo
                creado_por: `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`,
                policia_asignado: solicitud.policia
                    ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}`
                    : "No asignado",
                puntoGPS: solicitud.puntoGPS,
                ubicacion: {
                    distrito: distrito?.nombre_distrito || "Sin Distrito",
                    canton: canton?.nombre_canton || "Sin Cantón",
                    subzona: subzona?.nombre_subzona || "Sin Subzona",
                },
                fecha_creacion: solicitud.fecha_creacion.toISOString(), // Convertir la fecha a formato ISO 8601
            };
        });

        return solicitudesEstructuradas;
    } catch (error) {
        throw new Error("Error al obtener las solicitudes: " + error.message);
    }
};

//  crear solicitud de emergencia
exports.crearBotonEmergencia = async (personaData, io) => {
    const { id_persona, puntoGPS } = personaData;
    const transaction = await sequelize.transaction();
    
    try {
        console.log("➡️ Iniciando creación de botón de emergencia...");

        // 📌 Verificar si la persona existe
        const persona = await Persona.findByPk(id_persona);
        if (!persona) throw new Error("Persona no encontrada");

        console.log(`✅ Persona encontrada: ${persona.nombres} ${persona.apellidos}`);

        // 📌 Crear solicitud del botón de emergencia
        const nuevoBotonEmergencia = await Solicitud.create(
            { id_estado: 1, id_subtipo: 1, fecha_creacion: new Date(), puntoGPS, creado_por: id_persona },
            { transaction }
        );

        console.log(`✅ Botón de emergencia creado con ID: ${nuevoBotonEmergencia.id_solicitud}`);

        // 📌 Registrar el evento
        await SolicitudEventoPersona.create(
            { id_solicitud: nuevoBotonEmergencia.id_solicitud, id_evento: 1, id_persona },
            { transaction }
        );

        console.log("✅ Evento registrado en SolicitudEventoPersona");

        await transaction.commit(); // 🔹 Confirmar transacción antes de enviar notificaciones
        console.log("✅ Transacción confirmada con éxito.");
        
        // 📌 Obtener fecha/hora actual formateada
        const timestamp = new Date();

        // 🔹 **Emitir evento en Socket.IO con fecha/hora**
        io.emit("nuevoBotonEmergencia", {
            id_solicitud: nuevoBotonEmergencia.id_solicitud,
            mensaje: "Se ha activado un Botón de Emergencia.",
            fecha_tiempo_creacion: timestamp, // Incluir fecha de creación
        });

        io.emit("nuevaSolicitud", {
            id_solicitud: nuevoBotonEmergencia.id_solicitud,
            estado: "Pendiente",  // 🔹 Agregado el estado "Pendiente"
            tipoSolicitud: "Botón de Emergencia",  // 🔹 Tipo de solicitud
            subtipo: "Botón de Emergencia",  // 🔹 Subtipo
            creado_por: `${persona.nombres} ${persona.apellidos}`,  // 🔹 Nombre del creador
            fecha_creacion: nuevoBotonEmergencia.fecha_creacion ?? new Date().toISOString(), // 🔹 Evitar `Invalid Date`
            ubicacion: {
                distrito: nuevoBotonEmergencia.Distrito?.nombre_distrito ?? "Sin Distrito",
                canton: nuevoBotonEmergencia.Canton?.nombre_canton ?? "Sin Cantón",
                subzona: nuevoBotonEmergencia.Canton?.Subzona?.nombre_subzona ?? "Sin Subzona"
            }
        });

        // 🔹 **Ejecutar las notificaciones en una función asíncrona autoejecutable**
        (async () => {
            try {
                console.log("📢 Enviando notificaciones a Admins...");
                await notificarUsuariosPorRol(io, "Admin", "Emergencia 🚨", "Se ha activado un Botón de Emergencia.");
                
                console.log("📢 Enviando notificaciones a Policías...");
                await notificarUsuariosPorRol(io, "Policia", "Emergencia 🚨", "Se ha activado un Botón de Emergencia.");
            } catch (error) {
                console.error("❌ Error en las notificaciones:", error);
            }
        })();

        return nuevoBotonEmergencia;
    } catch (error) {
        await transaction.rollback();
        console.error("❌ Error en crearBotonEmergencia:", error);
        throw error;
    }
};

// 🔹 Crear una nueva solicitud (Denuncia Ciudadana o Servicio Comunitario)
exports.crearSolicitud = async (personaData, io) => {
    const { id_persona, puntoGPS, direccion, id_subtipo, observacion } = personaData;
    const transaction = await sequelize.transaction();

    try {
        console.log("➡️ Iniciando creación de solicitud...");

        // 📌 Verificar si la persona existe
        const persona = await Persona.findByPk(id_persona);
        if (!persona) throw new Error("Persona no encontrada");

        // 📌 Verificar si el subtipo existe y obtener su relación con el tipo de solicitud
        const subtipo = await Subtipo.findByPk(id_subtipo, {
            include: [{ model: TipoSolicitud, attributes: ["descripcion"] }] // ✅ Asegurar que el alias coincide con el modelo
        });

        if (!subtipo) throw new Error("Subtipo no encontrado");

        const id_tipo = subtipo.id_tipo;
        const tipoSolicitudDescripcion = subtipo?.TipoSolicitud?.descripcion || "Sin Tipo"; 
        const subtipoSolicitud = subtipo.descripcion || "Sin Subtipo";

        // 📌 Determinar el evento basado en el tipo de solicitud
        const id_evento = id_tipo === 2 ? 2 : id_tipo === 3 ? 3 : null;
        if (!id_evento) throw new Error("Tipo de solicitud no válido");

        // 📌 Crear la nueva solicitud
        const nuevaSolicitud = await Solicitud.create(
            { 
                id_estado: 1,
                id_subtipo,
                fecha_creacion: new Date(),
                puntoGPS,
                direccion,
                creado_por: id_persona,
                id_distrito: persona.id_distrito, // ✅ Asegurar que la solicitud tenga ubicación
                id_canton: persona.id_canton 
            },
            { transaction }
        );

        console.log(`✅ Solicitud creada con ID: ${nuevaSolicitud.id_solicitud}`);

        // 📌 Registrar el evento de la solicitud
        await SolicitudEventoPersona.create(
            { id_solicitud: nuevaSolicitud.id_solicitud, id_evento, id_persona },
            { transaction }
        );

        console.log("✅ Evento registrado en SolicitudEventoPersona");

        // 📌 Registrar la observación si existe
        if (observacion) {
            await Observacion.create(
                { id_solicitud: nuevaSolicitud.id_solicitud, observacion, id_persona },
                { transaction }
            );
        }

        // 📌 Obtener información adicional sobre la ubicación
        const solicitudConUbicacion = await Solicitud.findByPk(nuevaSolicitud.id_solicitud, {
            include: [
                {
                    model: Parroquia,
                     // ✅ Usamos la relación correcta
                    attributes: ["nombre_parroquia"],
                    include: [
                        {
                            model: Distrito,
                            as: "Distrito", // ✅ Accedemos a Distrito a través de Parroquia
                            attributes: ["nombre_distrito"]
                        },
                        {
                            model: Canton,
                            as: "Canton", 
                            attributes: ["nombre_canton"],
                            include: [{ model: Subzona, as: "Subzona", attributes: ["nombre_subzona"] }]
                        }
                    ]
                }
            ]
        });
        

        // 📌 Confirmar transacción antes de emitir eventos
        await transaction.commit();
        console.log("✅ Transacción confirmada con éxito.");

        // 📌 Emitir evento con datos completos
        io.emit("nuevaSolicitud", {
            id_solicitud: nuevaSolicitud.id_solicitud,
            estado: "Pendiente",
            tipoSolicitud: tipoSolicitudDescripcion,
            subtipo: subtipoSolicitud,
            creado_por: `${persona.nombres} ${persona.apellidos}`,
            fecha_creacion: nuevaSolicitud.fecha_creacion ?? new Date().toISOString(),
            ubicacion: {
                distrito: solicitudConUbicacion?.Parroquia?.Distrito?.nombre_distrito ?? "Sin Distrito",
                canton: solicitudConUbicacion?.Parroquia?.Canton?.nombre_canton ?? "Sin Cantón",
                subzona: solicitudConUbicacion?.Parroquia?.Canton?.Subzona?.nombre_subzona ?? "Sin Subzona"
            }
        });
        

        // 🔹 **Ejecutar las notificaciones en una función asíncrona autoejecutable**
        (async () => {
            try {
                console.log("📢 Enviando notificaciones a Admins...");
                await notificarUsuariosPorRol(io, "Admin", "Nueva Solicitud", "Se ha registrado una nueva solicitud.");
            } catch (error) {
                console.error("❌ Error en las notificaciones:", error);
            }
        })();

        return nuevaSolicitud;
    } catch (error) {
        await transaction.rollback();
        console.error("❌ Error en crearSolicitud:", error);
        throw error;
    }
};

// 🔹 Asignar un Policía a una Solicitud
exports.asignarPoliciaASolicitud = async (solicitudData, io) => {
    const { id_solicitud, id_persona_asignador, id_persona_policia } = solicitudData;
    const transaction = await sequelize.transaction();

    try {
        const asignador = await Persona.findByPk(id_persona_asignador);
        if (!asignador) throw new Error("Asignador no encontrado");

        const rolesAsignador = await asignador.getRoles();
        if (!rolesAsignador.some(rol => rol.descripcion === "Admin")) {
            throw new Error("No tienes permisos para asignar policías");
        }

        const policia = await Persona.findByPk(id_persona_policia);
        if (!policia) throw new Error("El policía no existe");

        const rolesPolicia = await policia.getRoles();
        if (!rolesPolicia.some(rol => rol.descripcion === "Policia")) {
            throw new Error("La persona a asignar no es un policía válido");
        }

        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) throw new Error("Solicitud no encontrada");

        // 🔹 📌 Verificar si el policía tiene menos de 10 solicitudes activas
        if (policia.solicitudes_activas >= 10) {
            throw new Error("Este policía ya tiene el máximo de 10 solicitudes activas.");
        }

        // 🔹 📌 Asignar la solicitud y actualizar el contador
        await Solicitud.update(
            { policia_asignado: id_persona_policia, id_estado: 2 }, 
            { where: { id_solicitud }, transaction }
        );

        // 🔹 📌 Aumentar el contador de solicitudes activas
        await Persona.update(
            { solicitudes_activas: policia.solicitudes_activas + 1 },
            { where: { id_persona: id_persona_policia }, transaction }
        );

        // 🔹 📌 Si el policía llega a 10 solicitudes, cambiar disponibilidad a "Ocupado"
        if (policia.solicitudes_activas + 1 >= 10) {
            await Persona.update(
                { disponibilidad: "Ocupado" },
                { where: { id_persona: id_persona_policia }, transaction }
            );
        }

        await SolicitudEventoPersona.create(
            { id_solicitud, id_evento: 10, id_persona: id_persona_policia },
            { transaction }
        );

        await transaction.commit();
        await getPoliciaCounts({ app: { get: () => io } });


        // 🔹 Notificar al policía y al creador de la solicitud
        notificarUsuarios(io, [id_persona_policia], "Nueva Asignación", "Se te ha asignado una nueva solicitud.");
        notificarUsuarios(io, [solicitud.creado_por], "Actualización", "Tu solicitud ya tiene un policía asignado.");  

        io.emit("actualizarSolicitud", { id_solicitud, estado: "En Progreso" });
        // • Emitir evento para actualizar Ia lista de policias en frontend
        io.emit("actua1izarPolicias");
        
        return { message: "Policía asignado correctamente." };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 🔹 Cerrar una Solicitud
exports.cerrarSolicitud = async (cerrarData, io) => {
    const { id_solicitud, observacion, estado_cierre } = cerrarData;
    const transaction = await sequelize.transaction();
    try {
        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) throw new Error("Solicitud no encontrada");

        const estadosValidos = { Resuelto: 3, Falso: 4 };
        if (!estadosValidos[estado_cierre]) throw new Error("Estado no válido");

        await Solicitud.update(
            { 
                id_estado: estadosValidos[estado_cierre],
                fecha_cierre: new Date()  // ✅ NUEVA LÍNEA
            },
            { where: { id_solicitud }, transaction }
        );

        await Observacion.create(
            { id_solicitud, observacion, id_persona: solicitud.policia_asignado },
            { transaction }
        );

        // 🔹 📌 Disminuir el contador de solicitudes activas
        const policia = await Persona.findByPk(solicitud.policia_asignado);
        if (policia) {
            await Persona.update(
                { solicitudes_activas: Math.max(0, policia.solicitudes_activas - 1) },
                { where: { id_persona: policia.id_persona }, transaction }
            );

            // 🔹 📌 Si el policía ahora tiene menos de 10 solicitudes, marcar como "Disponible"
            if (policia.solicitudes_activas - 1 < 10) {
                await Persona.update(
                    { disponibilidad: "Disponible" },
                    { where: { id_persona: policia.id_persona }, transaction }
                );
            }
        }

        await transaction.commit();
        io.emit("solicitudCerrada", { id_solicitud, estado: estado_cierre });
        io.emit("actualizarPolicias");

        return { message: "Solicitud cerrada correctamente." };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


exports.obtenerPoliciasDisponibles = async () => {
    try {
        const policias = await Persona.findAll({
            where: {
                solicitudes_activas: { [Op.lt]: 10 } // Menos de 10 solicitudes activas
            },
            include: [
                {
                    model: Rol,
                    as: "roles", // 👈 Aquí colocamos el alias correcto
                    attributes: ["id_rol", "descripcion"],
                    through: { attributes: [] } // Para no incluir la tabla intermedia
                }
            ],
            attributes: ["id_persona", "nombres", "apellidos", "solicitudes_activas"]
        });

        return policias;
    } catch (error) {
        throw new Error("Error al obtener policías disponibles: " + error.message);
    }
};



exports.agregarObservacion = async ({ id_solicitud, observacion, id_persona }) => {
  try {
    if (!id_solicitud || !observacion || !id_persona) {
      throw new Error("Faltan datos obligatorios para registrar la observación.");
    }

    await Observacion.create({
      id_solicitud,
      observacion,
      id_persona,
      fecha: new Date()
    });

    return { message: "Observación registrada con éxito." };
  } catch (error) {
    console.error("❌ Error en agregarObservacion:", error.message);
    throw error;
  }
};
