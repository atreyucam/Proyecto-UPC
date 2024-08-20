const multer = require('multer');
const solicitudService = require('./services/srv_solicitud');

exports.crearBotonEmergencia = async (req, res) => {
    try {
        const botonEmergencia = await solicitudService.crearBotonEmergencia(req.body);
        res.status(201).json(botonEmergencia);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

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
        const resultado = await solicitudService.asignarPoliciaASolicitud(req.body);
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
        }
    } catch (error) {
            res.status(404).json({message: 'Solicitud no encontrada'});
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



// -------------------------------------------------------------------------
// testing
const upload = multer({
  storage: multer.memoryStorage(), // Guardar archivos en memoria antes de procesarlos
});



exports.crearSolicitud = [
  upload.array('evidencias'), // Aceptar múltiples archivos
  async (req, res) => {
    try {
        const personaData = req.body;
        const evidencias = req.files; // Archivos de evidencia

        const nuevaSolicitud = await solicitudService.crearSolicitud(personaData, evidencias);
        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
];


//   exports.crearSolicitud = async (req, res) => {
//     try {
//         const personaData = req.body;
//         const nuevaSolicitud = await solicitudService.crearSolicitud(personaData);
//         res.status(201).json(nuevaSolicitud);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
