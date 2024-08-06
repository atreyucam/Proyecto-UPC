exports.getSolicitudes = async () => {
    // Buscar todas las solicitudes
    const solicitudes = await Solicitud.findAll({
        include: [
            { model: Circuito },
            { model: Subtipo, include: [{ model: TipoSolicitud }] },
            { model: Estado },
            {
                model: SolicitudEventoPersona,
                include: [{ model: Persona }, { model: Evento }],
                required: false // Permite que las solicitudes sin eventos también sean incluidas
            },
            {
                model: Observacion,
                include: [{model: Persona}],
                required: false
            },
            // Incluir Persona para obtener la información del creador
            {
                model: Persona,
                as: 'creador', // Usa el alias definido en la relación
                required: false
            }
        ]
    });

    // Estructurar la respuesta
    return solicitudes.map(solicitud => {
        // Filtrar eventos por tipo
        const eventos = solicitud.SolicitudEventoPersonas;
        // Filtrar solo los eventos de asignación de policía
        const policiasAsignados = solicitud.SolicitudEventoPersonas.filter(evento => evento.id_evento === 4);

        // Crear el objeto para la solicitud
        return {
            id_solicitud: solicitud.id_solicitud,
            id_estado: solicitud.Estado.descripcion,
            id_subtipo: solicitud.id_subtipo,
            fecha_creacion: solicitud.fecha_creacion,
            puntoGPS: solicitud.puntoGPS,
            direccion: solicitud.direccion,
            observacion: solicitud.observacion,
            id_circuito: solicitud.id_circuito,
            Circuito: solicitud.Circuito,
            Subtipo: solicitud.Subtipo,
            // Información del creador
            creador: solicitud.creador ? {
                id_persona: solicitud.creador.id_persona,
                cedula: solicitud.creador.cedula,
                nombres: solicitud.creador.nombres,
                apellidos: solicitud.creador.apellidos,
                telefono: solicitud.creador.telefono,
                email: solicitud.creador.email,
            } : null,
            // Policía asignado
            policia_asignado: policiasAsignados.length > 0 ? policiasAsignados.map(evento => ({
                id_persona: evento.id_persona,
                Persona: evento.Persona
            })) : 'No hay policía asignado',
            // Todos los eventos de la solicitud
            eventos: eventos.map(evento => ({
                id_evento: evento.id_evento,
                evento: evento.Evento.evento,
                id_persona: evento.id_persona,
                fecha_creacion: evento.fecha_creacion,
                Persona: {
                    nombres: evento.Persona.nombres,
                    apellidos: evento.Persona.apellidos
                }
            })),
            /// Todas las observaciones de la solicitud
            observaciones: solicitud.Observacions.map(obs => ({
            id_observacion: obs.id_observacion,
            id_persona: obs.id_persona,
            Persona: {
                nombres: obs.Persona.nombres,
                apellidos: obs.Persona.apellidos
            },
            observacion: obs.observacion,
            fecha: obs.fecha // Asegúrate de que la fecha esté incluida en el modelo Observacion
        }))
        };
    });
}


// * Asignar un policia a la solicitud
// // TODO: metodo en revision
// exports.asignarPoliciaSolicitud = async (policiaData) => {
//     const {id_solicitud, id_persona} = policiaData;
//     const id_evento = 4;
//     // const fecha_creacion = new Date(); // Fecha actual
//     const transaction = await sequelize.transaction();

//     try {
//         // * 1. Cambiamos el estado de la solicitud a "en progreso"
//         await Solicitud.update(
//             { id_estado: 2},
//             {where: {id_solicitud: id_solicitud}, transaction: transaction}
//         );

//         // *2. Registramos el evento
//         await SolicitudEventoPersona.create({
//             id_solicitud: id_solicitud,
//             id_evento,
//             id_persona: id_persona,
//             // fecha_creacion
//         },{transaction:transaction});

//         // * 3. Actualizamos la disponibilidad del policia
//         await Persona.update(
//             { disponibilidad: 'Ocupado'},
//             {where: {id_persona: id_persona}, transaction: transaction}
//         );

//         await transaction.commit();
//     } catch (error) {
//         await transaction.rollback();
//         console.log('Error al asignar policia a la solicitdud: ', error);
//         throw error;
//     }






// exports.getSolicitudById = async (idSolicitud) => {
//     // Buscar la solicitud por id
//     const solicitud = await Solicitud.findByPk(idSolicitud, {
//         include: [
//             { model: Circuito },
//             { model: Subtipo, include: [{ model: TipoSolicitud }] },
//             { model: Estado },
//             {
//                 model: SolicitudEventoPersona,
//                 include: [{ model: Persona },{ model: Evento }],
//                 required: false // Permite que las solicitudes sin eventos también sean incluidas
//             },
//             {
//                 model: Observacion,
//                 include: [{model: Persona}],
//                 required: false
//             },
//             {
//                 model: Persona,
//                 as: 'creador', // Usa el alias definido en la relación
//                 required: false
//             }
//         ]
//     });

//     // Verifica si la solicitud fue encontrada
//     if (!solicitud) {
//         throw new Error('Solicitud no encontrada');
//     }

//     // Filtra eventos y estructuración de datos
//     const eventos = solicitud.SolicitudEventoPersonas;
//     const policiasAsignados = solicitud.SolicitudEventoPersonas.filter(evento => evento.id_evento === 4);

//     return {
//         id_solicitud: solicitud.id_solicitud,
//         id_estado: solicitud.Estado.descripcion,
//         id_subtipo: solicitud.id_subtipo,
//         fecha_creacion: solicitud.fecha_creacion,
//         puntoGPS: solicitud.puntoGPS,
//         direccion: solicitud.direccion,
//         observacion: solicitud.observacion,
//         id_circuito: solicitud.id_circuito,
//         Circuito: solicitud.Circuito,
//         Subtipo: solicitud.Subtipo,
//         // Información del ciudadano
//         // Información del creador
//         creador: solicitud.creador ? {
//             id_persona: solicitud.creador.id_persona,
//             cedula: solicitud.creador.cedula,
//             nombres: solicitud.creador.nombres,
//             apellidos: solicitud.creador.apellidos,
//             telefono: solicitud.creador.telefono,
//             email: solicitud.creador.email,
//         } : null,
//         // Policia asignado
//         policia_asignado: policiasAsignados.length > 0 ? policiasAsignados.map(evento => ({
//             id_persona: evento.id_persona,
//             Persona: evento.Persona
//         })) : 'No hay policía asignado',
//         // Todos los eventos de la solicitud
//         eventos: eventos.map(evento => ({
//             id_evento: evento.id_evento,
//             evento: evento.Evento.evento,
//             id_persona: evento.id_persona,
//             fecha_creacion: evento.fecha_creacion,
//             Persona: {
//                 nombres: evento.Persona.nombres,
//                 apellidos: evento.Persona.apellidos
//             }
//         })),
//         // Todas las observaciones de la solicitud
//         observaciones: solicitud.Observacions.map(obs => ({
//             id_observacion: obs.id_observacion,
//             id_persona: obs.id_persona,
//             Persona: {
//                 nombres: obs.Persona.nombres,
//                 apellidos: obs.Persona.apellidos
//             },
//             observacion: obs.observacion,
//             fecha: obs.fecha // Asegúrate de que la fecha esté incluida en el modelo Observacion
//         }))
//     };
// }
