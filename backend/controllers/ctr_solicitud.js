const solicitudService = require('./services/srv_solicitud');

exports.crearBotonEmergencia = async (req, res) => {
    try {
        const botonEmergencia = await solicitudService.crearBotonEmergencia(req.body);
        res.status(201).json(botonEmergencia);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * * Controlador para obtener todas las personas.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// TODO: Metodo en revision
exports.getSolicitudes = async (req, res) => {
    try {
      const solicitudes = await solicitudService.getSolicitudes();
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.asignarPoliciaSolicitud = async (req, res) => {
    try {
        await solicitudService.asignarPoliciaSolicitud(req.body);
        res.status(200).json({ message: `Policía asignado correctamente a la solicitud ${req.body.id_solicitud}` });
    } catch (error) {
        res.status(500).json({ message: `Error al asignar el policía a la solicitud: ${error.message}` });
    }
}

exports.cerrarSolicitud = async (req, res) => {
    try {
      await solicitudService.cerrarSolicitud(req.body);
      res.status(200).json({ message: 'Solicitud cerrada correctamente.' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

exports.agregarObservacion = async (req, res) => {
    try {
        await solicitudService.agregarObservacion(req.body);
        res.status(200).json({ message: 'Observación agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
