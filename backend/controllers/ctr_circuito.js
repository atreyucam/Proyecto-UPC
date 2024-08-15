const circuitoService = require('./services/srv_circuito');

/**
 * * Controlador para crear un nuevo circuito.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Modulo en funcionamiento
exports.createCircuito = async (req, res) => {
  try {
    const circuito = await circuitoService.createCircuito(req.body);
    res.status(201).json(circuito);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
* * Controlador para obtener todos los circuitos o filtrarlos según parámetros.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.getCircuitos = async (req, res) => {
    try {
        const filters = req.query; // Los filtros vienen como parámetros de consulta
        const circuitos = await circuitoService.getCircuitos(filters);
        res.status(200).json(circuitos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* * Controlador para obtener un circuito por su ID.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.getCircuitoById = async (req, res) => {
  try {
      const circuito = await circuitoService.getCircuitoById(req.params.id);
      if (circuito) {
          res.status(200).json(circuito);
      } else {
          res.status(404).json({ message: 'Circuito not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

/**
* * Controlador para actualizar un circuito existente.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.updateCircuito = async (req, res) => {
  try {
      const circuito = await circuitoService.updateCircuito(req.params.id, req.body);
      if (circuito) {
          res.status(200).json(circuito);
      } else {
          res.status(404).json({ message: 'Circuito not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

/**
* * Controlador para eliminar un circuito por su ID.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.deleteCircuito = async (req, res) => {
  try {
      const circuito = await circuitoService.deleteCircuito(req.params.id);
      if (circuito) {
          res.status(200).json({ message: 'Circuito deleted successfully' });
      } else {
          res.status(404).json({ message: 'Circuito not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};