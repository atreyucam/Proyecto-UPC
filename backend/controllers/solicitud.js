const { Solicitud, SolicitudEventoPersona, NotificacionPersona, Evento, Estado, Subtipo, Persona } = require('../models/db_models');

// crear una nueva solicitud
exports.createSolicitud = async (req,res) => {
    const { id_persona, id_estado, id_subtipo, puntoGPS, direccion, observacion } = req.body;
  try {
    const nuevaSolicitud = await Solicitud.create({
      id_estado,
      id_subtipo,
      puntoGPS,
      direccion,
      observacion
    });

    // Obtener el tipo de evento basado en el subtipo
    const subtipo = await Subtipo.findByPk(id_subtipo, { include: 'TipoSolicitud' });
    let id_evento = null;

    if (subtipo.id_tipo === 1) {
      id_evento = 1;  // El usuario ha presionado el botón de seguridad
    } else if (subtipo.id_tipo === 2) {
      id_evento = 2;  // El ciudadano ha registrado una denuncia ciudadana
    } else if (subtipo.id_tipo === 3) {
      id_evento = 3;  // El ciudadano ha registrado un servicio comunitario
    }

    await SolicitudEventoPersona.create({
      id_solicitud: nuevaSolicitud.id_solicitud,
      id_evento,
      id_persona
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las solicitudes
exports.getAllSolicitudes = async (req, res) => {
    try {
      const solicitudes = await Solicitud.findAll();
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Obtener una solicitud por ID
exports.getSolicitudById = async (req, res) => {
    const { id } = req.params;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.status(200).json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Actualizar una solicitud
exports.updateSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_estado, id_subtipo, puntoGPS, direccion, observacion } = req.body;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
  
      solicitud.id_estado = id_estado;
      solicitud.id_subtipo = id_subtipo;
      solicitud.puntoGPS = puntoGPS;
      solicitud.direccion = direccion;
      solicitud.observacion = observacion;
      await solicitud.save();
  
      res.status(200).json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Eliminar una solicitud
exports.deleteSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
  
      await solicitud.destroy();
      res.status(200).json({ message: 'Solicitud eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Asignar un policía a la solicitud
exports.assignPolicia = async (req, res) => {
    const { id } = req.params;
    const { id_persona, id_evento } = req.body;
    try {
      await Solicitud.update(
        { id_estado: 2 },  // En Camino
        { where: { id_solicitud: id } }
      );
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      await NotificacionPersona.create({
        id_solicitud: id,
        id_notificacion: 2,  // Suponiendo que el ID 1 es la notificación de "Policía en camino"
        id_persona
      });
  
      res.status(200).json({ message: 'Policía asignado y notificado. En camino' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Registrar un evento general
exports.registrarEvento = async (req, res) => {
    const { id } = req.params;
    const { id_evento, id_persona } = req.body;
    try {
      // Verificar que la persona, el evento y la solicitud existan
      const solicitud = await Solicitud.findByPk(id);
      const persona = await Persona.findByPk(id_persona);
      const evento = await Evento.findByPk(id_evento);
  
      if (!solicitud || !persona || !evento) {
        return res.status(400).json({ error: 'Solicitud, persona o evento no encontrados' });
      }
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      res.status(200).json({ message: 'Evento registrado con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Marcar solicitud como resuelta
exports.resolveSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_persona, id_evento } = req.body;
    try {
      await Solicitud.update(
        { id_estado: 3 },  // Resuelto
        { where: { id_solicitud: id } }
      );
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      await NotificacionPersona.create({
        id_solicitud: id,
        id_notificacion: 2,  // Suponiendo que el ID 2 es la notificación de "Policía llegó y resolvió el caso"
        id_persona
      });
  
      res.status(200).json({ message: 'Solicitud resuelta y notificada.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };