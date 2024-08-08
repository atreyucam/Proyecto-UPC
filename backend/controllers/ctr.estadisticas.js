const estadisticasService = require('./services/srv_estadisticas');

// Función para manejar la solicitud de contadores de policías
exports.getPoliciaCountsController = async (req, res) => {
    try {
      const counts = await estadisticasService.getPoliciaCounts();
      res.status(200).json(counts);
    } catch (error) {
      console.error("Error al obtener los contadores de policías:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };


// Función para manejar la solicitud de cantidad de solicitudes por tipo del mes actual
exports.getContadorSolicitudesTotal = async (req, res) => {
    try {
        const resultados = await estadisticasService.getContadorSolicitudesTotal();
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener las solicitudes totales:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};