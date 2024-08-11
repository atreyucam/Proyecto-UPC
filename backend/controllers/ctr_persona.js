const personaService = require('./services/srv_persona');

/**
 * * Controlador para crear una nueva persona.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.createPersona = async (req, res) => {
  try {
    const persona = await personaService.createPersona(req.body);
    res.status(201).json(persona);
  } catch (error) {
    // Verifica si el error es de unicidad
    if (error.message === 'La cédula ya está registrada.' || error.message === 'El email ya está registrado.') {
      return res.status(409).json({ message: error.message });
    }
    
    // Otros errores
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


/**
 * * Controlador para obtener todas las personas.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.getPersonas = async (req, res) => {
  try {
    const personas = await personaService.getPersonas();
    res.status(200).json(personas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * * Controlador para obtener una persona por su ID.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.getPersonaById = async (req, res) => {
  try {
    const persona = await personaService.getPersonaById(req.params.id);
    if (persona) {
      res.status(200).json(persona);
    } else {
      res.status(404).json({ message: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * * Controlador para actualizar una persona existente.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.updatePersona = async (req, res) => {
  try {
    const persona = await personaService.updatePersona(req.params.id, req.body);
    if (persona) {
      res.status(200).json(persona);
    } else {
      res.status(404).json({ message: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * * Controlador para eliminar una persona por su ID.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.deletePersona = async (req, res) => {
  try {
    const persona = await personaService.deletePersona(req.params.id);
    if (persona) {
      res.status(200).json({ message: 'Persona deleted successfully' });
    } else {
      res.status(404).json({ message: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------------------------
// filtros
/**
 * * Controlador para filtrar ciudadanos por circuito.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en funcionamiento
exports.getCiudadanos = async (req, res) => {
  try {
    const { ciudadanos, count } = await personaService.getCiudadanos(req.params.idCircuito);
    res.status(200).json({ ciudadanos, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * * Controlador para filtrar policías.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Metodo en Funcionamiento
exports.getPolicias = async (req, res) => {
  try {
    const { countPolicias, policias } = await personaService.getPolicias();
    res.status(200).json({ countPolicias, policias });
  } catch (error) {
    console.log('entra?');
    res.status(500).json({ error: error.message });
  }
};



// ---------------------------------------------------------
// * Para listar a un ciudadano con sus solicitudes
exports.getCiudadanoConSolicitudes = async (req, res) => {
  const { id } = req.params;
  try {
      const ciudadano = await personaService.getCiudadanoConSolicitudes(id);
      res.status(200).json(ciudadano);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getPoliciaConSolicitudes = async (req, res) => {
  const { id } = req.params;
  try {
      const policia = await personaService.getPoliciaConSolicitudes(id);
      res.status(200).json(policia);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


exports.getPoliciasDisponibles = async (req, res) => {
  try {
    const { countPolicias, policias } = await personaService.getPoliciasDisponibles();
    res.status(200).json({ countPolicias, policias });
  } catch (error) {
    console.log('entra?');
    res.status(500).json({ error: error.message });
  }
};
