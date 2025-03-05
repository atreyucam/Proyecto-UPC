const solicitudService = require("../services/srv_solicitud");

exports.crearBotonEmergencia = async (req, res) => {
  try {
    const io = req.io;
    const botonEmergencia = await solicitudService.crearBotonEmergencia(req.body,io);
    res.status(201).json(botonEmergencia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await solicitudService.getSolicitudes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.asignarPolicia = async (req, res) => {
  try {
    const io = req.io;
    const resultado = await solicitudService.asignarPoliciaASolicitud(req.body,io);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSolicitudById = async (req, res) => {
  try {
    const solicitud = await solicitudService.getSolicitudById(req.params.id);
    if (solicitud) {
      res.status(200).json(solicitud);
    } else {
      res.status(404).json({ message: "Solicitud no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la solicitud: " + error.message });
  }
};

exports.cerrarSolicitud = async (req, res) => {
  try {
    const io = req.io;
    await solicitudService.cerrarSolicitud(req.body,io);
    res.status(200).json({ message: "Solicitud cerrada correctamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.agregarObservacion = async (req, res) => {
  try {
    await solicitudService.agregarObservacion(req.body);
    res.status(200).json({ message: "Observación agregada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await solicitudService.getSolicitudesPendientes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.top10SolicitudesRecientes = async (req, res) => {
  try {
    const solicitudes = await solicitudService.top10SolicitudesRecientes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.crearSolicitud = async (req, res) => {
  try {
    const personaData = req.body;
    const io = req.io; // Obtener el objeto io desde la solicitud
    const nuevaSolicitud = await solicitudService.crearSolicitud(personaData, io);
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
