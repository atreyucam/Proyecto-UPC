const { Solicitud, SolicitudEventoPersona, Subtipo, Persona, sequelize, TipoSolicitud, Circuito, Observacion } = require('../../models/db_models');

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
exports.crearBotonEmergencia = async (persanaData) => {
    const {id_persona, puntoGPS} = persanaData;
    const transaction = await sequelize.transaction();
    try {
        // obtener el circuito de la persona que crea el boton de emergencia
        const persona = await Persona.findByPk(id_persona);
        const id_circuito = persona.id_circuito;
        const id_subtipo = 1; // * boton de emergencia
        const id_estado = 1; // * estado [Pendiente]
        const id_evento = 1 // * El Ciudadano ha presionado el boton de emergencia

        // Crear solicitud del llamado de auxilio
        const nuevoBotonEmergencia = await Solicitud.create(
            {id_estado, id_subtipo, puntoGPS, observacion: null, id_circuito},
            {transaction}
        );

        await SolicitudEventoPersona.create(
            {
                id_solicitud: nuevoBotonEmergencia.id_solicitud,
                id_evento,
                id_persona  
            },
            {transaction}
        );
        
        await transaction.commit();
        return nuevoBotonEmergencia;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// * Obtiene todas las solicitudes creadas con toda la información de la solicitud, incluyendo los policías asignados.
// TODO: motodo en revision
exports.getSolicitudes = async () => {
    // Buscar todas las solicitudes
    const solicitudes = await Solicitud.findAll({
        include: [
            { model: Circuito },
            { model: Subtipo, include: [{ model: TipoSolicitud }] },
            {
                model: SolicitudEventoPersona,
                include: [{ model: Persona }],
                required: false // Permite que las solicitudes sin eventos también sean incluidas
            },
            {
                model: Observacion,
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
            id_estado: solicitud.id_estado,
            id_subtipo: solicitud.id_subtipo,
            fecha_creacion: solicitud.fecha_creacion,
            puntoGPS: solicitud.puntoGPS,
            direccion: solicitud.direccion,
            observacion: solicitud.observacion,
            id_circuito: solicitud.id_circuito,
            Circuito: solicitud.Circuito,
            Subtipo: solicitud.Subtipo,
            // Policia asignado
            policia_asignado: policiasAsignados.length > 0 ? policiasAsignados.map(evento => ({
                id_persona: evento.id_persona,
                Persona: evento.Persona
            })) : 'No hay policía asignado',
            // Todos los eventos de la solicitud
            eventos: eventos.map(evento => ({
                id_evento: evento.id_evento,
                id_persona: evento.id_persona,
                Persona: {
                    nombres: evento.Persona.nombres,
                    apellidos: evento.Persona.apellidos
                }
            })),
            // Todas las observaciones de la solicitud
            observaciones: solicitud.Observacions.map(obs => ({
                id_observacion: obs.id_observacion,
                observacion: obs.observacion,
                fecha: obs.fecha // Asegúrate de que la fecha esté incluida en el modelo Observacion
            }))
        };
    });
}


// * Asignar un policia a la solicitud
// TODO: metodo en revision
exports.asignarPoliciaSolicitud = async (policiaData) => {
    const {id_solicitud, id_persona} = policiaData;
    const id_evento = 4;
    const transaction = await sequelize.transaction();

    try {
        // * 1. Cambiamos el estado de la solicitud a "en progreso"
        await Solicitud.update(
            { id_estado: 2},
            {where: {id_solicitud: id_solicitud}, transaction: transaction}
        );

        // *2. Registramos el evento
        await SolicitudEventoPersona.create({
            id_solicitud: id_solicitud,
            id_evento,
            id_persona: id_persona
        },{transaction:transaction});

        // * 3. Actualizamos la disponibilidad del policia
        await Persona.update(
            { disponibilidad: 'Ocupado'},
            {where: {id_persona: id_persona}, transaction: transaction}
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error al asignar policia a la solicitdud: ', error);
        throw error;
    }
}

// * Cerrar solicitud y actulizacion de la disponbilidad del policia
// TODO: metodo en revision
exports.cerrarSolicitud = async (cerrarData) => {
    const {id_solicitud, id_persona, estado, observaciones} = cerrarData;
    const id_evento = 6 // se ha cerrado la solicitud de emergencia
    const transaction = await sequelize.transaction();

    try {
        // * 1. Cambiamos el estado de la solicitud a "Resuelto o falso"
        await Solicitud.update(
            { id_estado: estado},
            {where: {id_solicitud: id_solicitud}, transaction: transaction}
        );

        // *2. Registramos el evento
        await SolicitudEventoPersona.create({
            id_solicitud: id_solicitud,
            id_evento,
            id_persona: id_persona
        },{transaction:transaction});

        // * 3. Actualizamos la disponibilidad del policia
        await Persona.update(
            { disponibilidad: 'Disponible'},
            {where: {id_persona: id_persona}, transaction: transaction}
        );
        // * 4. Registramos las observaciones
        if (observaciones) {
            await Observacion.create({
                id_solicitud: id_solicitud,
                observacion: observaciones,
                id_persona: id_persona
            }, { transaction: transaction });
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error al cerrar solicitud: ', error);
        throw error;
    }
}

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