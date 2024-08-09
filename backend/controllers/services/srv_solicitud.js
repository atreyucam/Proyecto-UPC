const { Solicitud, SolicitudEventoPersona, Subtipo, Persona, sequelize, TipoSolicitud, Circuito, Observacion, Estado, Evento, Rol} = require('../../models/db_models');

// * Crear boton de emergencia
/** 
 * * El metodo permite crear a los usuarios una solicitud de boton de emergencia
 * * este crea segun el puntoGPS que tiene, y por defecto registra:
 * * id_subtipo = 1 como boton de emergencia
 * * id_estado = 1 como pendiente
 * * id_evento = 1 segun como se ha configurado los eventos en la tabla,
 * * lo que 1 es = que el ciudadano ha presionado el boton de emergencia.
 */
//  TODO:Metodo en revision
exports.crearBotonEmergencia = async (personaData) => {
    const { id_persona, puntoGPS } = personaData;
    const transaction = await sequelize.transaction();
    
    try {
        // Obtener el circuito de la persona que crea el botón de emergencia
        const persona = await Persona.findByPk(id_persona);
        if (!persona) {
            throw new Error('Persona no encontrada');
        }
        const id_circuito = persona.id_circuito;
        
        // Definir IDs para subtipo, estado y evento
        const id_subtipo = 1; // Botón de emergencia
        const id_estado = 1; // Estado [Pendiente]
        const id_evento = 1; // El Ciudadano ha presionado el botón de emergencia

        // Crear solicitud del botón de emergencia
        const nuevoBotonEmergencia = await Solicitud.create({
            id_estado,
            id_subtipo,
            fecha_creacion: new Date(),
            puntoGPS,
            direccion: null, // La dirección puede ser opcional si ya se tiene el puntoGPS
            observacion: null,
            id_circuito,
            creado_por: id_persona
        }, { transaction });

        // Crear la relación entre la solicitud y el evento
        await SolicitudEventoPersona.create({
            id_solicitud: nuevoBotonEmergencia.id_solicitud,
            id_evento,
            id_persona
        }, { transaction });
        
        await transaction.commit();
        return nuevoBotonEmergencia;

    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la solicitud de botón de emergencia:', error);
        throw error;
    }
};


exports.getSolicitudes = async () => {
    try {
        // Obtener todas las solicitudes con información asociada, ordenadas por fecha de creación ascendente
        const solicitudes = await Solicitud.findAll({
            include: [
                {
                    model: Persona,
                    as: 'creador',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Persona,
                    as: 'policia',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ['descripcion'] // Asegúrate de incluir la descripción del tipo de solicitud
                        }
                    ],
                    attributes: ['descripcion']
                },
                {
                    model: Estado,
                    attributes: ['descripcion']
                },
                {
                    model: Circuito,
                    attributes: ['provincia', 'ciudad', 'barrio', 'numero_circuito']
                }
            ],
            order: [['fecha_creacion', 'DESC']] // Ordenar por fecha_creacion ascendente
        });

        // Mapear las solicitudes para estructurar la respuesta
        const solicitudesEstructuradas = solicitudes.map(solicitud => ({
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado.descripcion,
            tipo: solicitud.Subtipo.TipoSolicitud.descripcion, // Agregar tipo de solicitud
            subtipo: solicitud.Subtipo.descripcion, // Agregar subtipo
            creado_por: `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`,
            policia_asignado: solicitud.policia ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}` : 'No asignado',
            puntoGPS: solicitud.puntoGPS,
            circuito: {
                provincia: solicitud.Circuito.provincia,
                ciudad: solicitud.Circuito.ciudad,
                barrio: solicitud.Circuito.barrio,
                numero_circuito: solicitud.Circuito.numero_circuito
            },
            fecha_creacion: solicitud.fecha_creacion.toISOString() // Convertir la fecha a formato ISO 8601
        }));

        return solicitudesEstructuradas;
    } catch (error) {
        throw new Error('Error al obtener las solicitudes: ' + error.message);
    }
};



exports.asignarPoliciaASolicitud = async (solicitudData) => {
    const { id_solicitud, id_persona_asignador, id_persona_policia } = solicitudData;
    const transaction = await sequelize.transaction();
    
    try {
        // Verificar que la persona que asigna es un policía
        const asignador = await Persona.findByPk(id_persona_asignador);
        if (!asignador) {
            throw new Error('La persona que realiza la asignación no existe.');
        }
        const rolesAsignador = await asignador.getRols();  // Obtener roles de la persona
        if (!rolesAsignador.some(rol => rol.descripcion === 'Admin')) {
            throw new Error('La persona que realiza la asignación no es administrador.');
        }

        // Verificar que el policía a asignar existe y es un policía
        const policia = await Persona.findByPk(id_persona_policia);
        if (!policia) {
            throw new Error('El policía especificado no existe.');
        }
        const rolesPolicia = await policia.getRols();  // Obtener roles del policía
        if (!rolesPolicia.some(rol => rol.descripcion === 'Policia')) {
            throw new Error('La persona a asignar no es un policía.');
        }

        // Verificar que la solicitud existe
        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) {
            throw new Error('La solicitud especificada no existe.');
        }

        // Asignar el policía a la solicitud y actualizar el estado de la solicitud
        await Solicitud.update(
            { policia_asignado: id_persona_policia, id_estado: 2 },  // Actualizar a 'En progreso'
            { where: { id_solicitud }, transaction }
        );

        // Actualizar la disponibilidad del policía a 'Ocupado'
        await Persona.update(
            { disponibilidad: 'Ocupado' },
            { where: { id_persona: id_persona_policia }, transaction }
        );

        await transaction.commit();
        return { message: 'Policía asignado a la solicitud correctamente.' };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getSolicitudById = async (id_solicitud) => {
    try {
        // Obtener la solicitud con toda la información asociada
        const solicitud = await Solicitud.findByPk(id_solicitud, {
            include: [
                {
                    model: Persona,
                    as: 'creador',
                    attributes: ['id_persona', 'nombres', 'apellidos']
                },
                {
                    model: Persona,
                    as: 'policia',
                    attributes: ['id_persona', 'nombres', 'apellidos']
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ['descripcion'] // Asegúrate de incluir la descripción del tipo de solicitud
                        }
                    ],
                    attributes: ['descripcion']
                },
                {
                    model: Estado,
                    attributes: ['descripcion']
                },
                {
                    model: Circuito,
                    attributes: ['provincia', 'ciudad', 'barrio', 'numero_circuito']
                },
                {
                    model: SolicitudEventoPersona,
                    include: [
                        {
                            model: Evento,
                            attributes: ['evento'] // Solo la descripción del evento
                        },
                        {
                            model: Persona,
                            attributes: ['id_persona', 'nombres', 'apellidos']
                        }
                    ],
                    attributes: ['fecha_creacion'],
                    order: [['fecha_creacion', 'ASC']]
                },
                {
                    model: Observacion,
                    include: [
                        {
                            model: Persona,
                            attributes: ['id_persona', 'nombres', 'apellidos']
                        }
                    ],
                    attributes: ['observacion', 'fecha'],
                    order: [['fecha', 'ASC']]
                }
            ]
        });

        if (!solicitud) {
            throw new Error('La solicitud especificada no existe.');
        }

        // Mapear la solicitud para reemplazar el id_estado y el id_subtipo por sus descripciones
        const formattedSolicitud = {
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado.descripcion, // Reemplazar id_estado por descripcion
            tipo: solicitud.Subtipo.TipoSolicitud.descripcion, // Agregar tipo de solicitud
            subtipo: solicitud.Subtipo.descripcion, // Reemplazar id_subtipo por descripcion
            fecha_creacion: solicitud.fecha_creacion,
            puntoGPS: solicitud.puntoGPS,
            direccion: solicitud.direccion,
            circuito: solicitud.Circuito,
            creado_por: solicitud.creador,
            policia_asignado: solicitud.policia,
            SolicitudEventoPersonas: solicitud.SolicitudEventoPersonas.map(sep => ({
                id_evento: sep.Evento.evento, // Solo mostrar la descripción del evento
                fecha_creacion: sep.fecha_creacion,
                persona: sep.Persona
            })),
            Observacions: solicitud.Observacions.map(obs => ({
                observacion: obs.observacion,
                fecha: obs.fecha,
                persona: obs.Persona
            }))
        };

        return formattedSolicitud;

    } catch (error) {
        throw new Error('Error al obtener la solicitud: ' + error.message);
    }
};

exports.cerrarSolicitud = async (cerrarData) => {
    const { id_solicitud, observacion } = cerrarData;
    const transaction = await sequelize.transaction();
    try {
        // Verificar que la solicitud existe
        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) {
            throw new Error('La solicitud especificada no existe.');
        }

        const id_persona_policia = solicitud.policia_asignado;

        // Verificar que el policía asignado existe
        const policia = await Persona.findByPk(id_persona_policia);
        if (!policia) {
            throw new Error('El policía asignado no existe.');
        }

        // Actualizar el estado de la solicitud a "Resuelto"
        const estadoResuelto = 3; // ID del estado "Resuelto"
        await Solicitud.update(
            { id_estado: estadoResuelto },
            { where: { id_solicitud }, transaction }
        );

        // Actualizar la disponibilidad del policía a "Disponible"
        await Persona.update(
            { disponibilidad: 'Disponible' },
            { where: { id_persona: id_persona_policia }, transaction }
        );

        // Crear la observación
        await Observacion.create(
            {
                id_solicitud,
                observacion,
                id_persona: id_persona_policia, // El mismo policía asignado hace la observación
            },
            { transaction }
        );

        await transaction.commit();
        return { message: 'Solicitud cerrada correctamente.' };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};






// *Agregar una nueva observacion a la solicitud
exports.agregarObservacion = async (observacionData) => {
    const { id_solicitud, observacion, id_persona } = observacionData;
    const transaction = await sequelize.transaction();

    try {
        // * 1. Registramos la observación
        await Observacion.create({
            id_solicitud: id_solicitud,
            observacion: observacion,
            id_persona: id_persona
        }, { transaction: transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error al agregar observación: ', error);
        throw error;
    }
}






exports.crearSolicitud = async (personaData) => {
    const { id_persona, puntoGPS, direccion, id_subtipo } = personaData;
    const transaction = await sequelize.transaction();

    try {
        // Obtener el circuito de la persona que crea la solicitud
        const persona = await Persona.findByPk(id_persona);
        if (!persona) {
            throw new Error('Persona no encontrada');
        }
        const id_circuito = persona.id_circuito;

        // Obtener el subtipo y verificar que sea válido
        const subtipo = await Subtipo.findByPk(id_subtipo);
        if (!subtipo) {
            throw new Error('Subtipo no encontrado');
        }

        // Determinar el tipo de solicitud y el evento asociado
        const id_tipo = subtipo.id_tipo;
        let id_evento;
        if (id_tipo === 2) {
            id_evento = 2; // Denuncia ciudadana
        } else if (id_tipo === 3) {
            id_evento = 3; // Servicios comunitarios
        } else {
            throw new Error('Tipo de solicitud no válido');
        }

        // Definir ID para estado
        const id_estado = 1; // Pendiente

        // Crear solicitud
        const nuevaSolicitud = await Solicitud.create({
            id_estado,
            id_subtipo,
            fecha_creacion: new Date(),
            puntoGPS,
            direccion, // Incluir la dirección proporcionada
            id_circuito,
            creado_por: id_persona
        }, { transaction });

        // Crear la relación entre la solicitud y el evento
        await SolicitudEventoPersona.create({
            id_solicitud: nuevaSolicitud.id_solicitud,
            id_evento,
            id_persona
        }, { transaction });

        await transaction.commit();
        return nuevaSolicitud;

    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la solicitud:', error);
        throw error;
    }
};




exports.getSolicitudesPendientes = async () => {
    try {
        // Obtener las solicitudes con estado "Pendiente", con información asociada, ordenadas por fecha de creación descendente
        const solicitudesPendientes = await Solicitud.findAll({
            where: {
                '$Estado.descripcion$': 'Pendiente' // Filtrar por estado "Pendiente"
            },
            include: [
                {
                    model: Persona,
                    as: 'creador',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Persona,
                    as: 'policia',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ['descripcion'] // Incluir la descripción del tipo de solicitud
                        }
                    ],
                    attributes: ['descripcion']
                },
                {
                    model: Estado,
                    attributes: ['descripcion']
                },
                {
                    model: Circuito,
                    attributes: ['provincia', 'ciudad', 'barrio', 'numero_circuito']
                }
            ],
            order: [['fecha_creacion', 'DESC']] // Ordenar por fecha_creacion descendente
        });

        // Mapear las solicitudes para estructurar la respuesta
        const solicitudesEstructuradas = solicitudesPendientes.map(solicitud => ({
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado.descripcion,
            tipo: solicitud.Subtipo.TipoSolicitud.descripcion, // Agregar tipo de solicitud
            subtipo: solicitud.Subtipo.descripcion, // Agregar subtipo
            creado_por: `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`,
            policia_asignado: solicitud.policia ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}` : 'No asignado',
            // puntoGPS: solicitud.puntoGPS,
            circuito: {
                provincia: solicitud.Circuito.provincia,
                ciudad: solicitud.Circuito.ciudad,
                barrio: solicitud.Circuito.barrio,
                numero_circuito: solicitud.Circuito.numero_circuito
            },
            fecha_creacion: solicitud.fecha_creacion.toISOString() // Convertir la fecha a formato ISO 8601
        }));

        return solicitudesEstructuradas;
    } catch (error) {
        throw new Error('Error al obtener las solicitudes pendientes: ' + error.message);
    }
};


exports.top10SolicitudesRecientes = async () => {
    try {
        // Obtener las 10 solicitudes más recientes con información asociada
        const solicitudes = await Solicitud.findAll({
            include: [
                {
                    model: Persona,
                    as: 'creador',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Persona,
                    as: 'policia',
                    attributes: ['nombres', 'apellidos']
                },
                {
                    model: Subtipo,
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: ['descripcion'] // Incluir la descripción del tipo de solicitud
                        }
                    ],
                    attributes: ['descripcion']
                },
                {
                    model: Estado,
                    attributes: ['descripcion']
                },
                {
                    model: Circuito,
                    attributes: ['provincia', 'ciudad', 'barrio', 'numero_circuito']
                }
            ],
            order: [['fecha_creacion', 'DESC']], // Ordenar por fecha_creacion descendente
            limit: 5 // Limitar los resultados a los 10 más recientes
        });

        // Mapear las solicitudes para estructurar la respuesta
        const solicitudesEstructuradas = solicitudes.map(solicitud => ({
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.Estado.descripcion,
            tipo: solicitud.Subtipo.TipoSolicitud.descripcion, // Agregar tipo de solicitud
            subtipo: solicitud.Subtipo.descripcion, // Agregar subtipo
            creado_por: `${solicitud.creador.nombres} ${solicitud.creador.apellidos}`,
            policia_asignado: solicitud.policia ? `${solicitud.policia.nombres} ${solicitud.policia.apellidos}` : 'No asignado',
            puntoGPS: solicitud.puntoGPS,
            circuito: {
                provincia: solicitud.Circuito.provincia,
                ciudad: solicitud.Circuito.ciudad,
                barrio: solicitud.Circuito.barrio,
                numero_circuito: solicitud.Circuito.numero_circuito
            },
            fecha_creacion: solicitud.fecha_creacion.toISOString() // Convertir la fecha a formato ISO 8601
        }));

        return solicitudesEstructuradas;
    } catch (error) {
        throw new Error('Error al obtener las solicitudes recientes: ' + error.message);
    }
};
