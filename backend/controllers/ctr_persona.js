const personaService = require('../services/srv_persona');


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
    const { countCiudadanos, ciudadanos } = await personaService.getCiudadanos();
    res.status(200).json({ countCiudadanos, ciudadanos  });
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




//* NUEVAS FUNCIONES
// funciones de prueba
// Controlador para crear un ciudadano
exports.createCiudadano = async (req, res) => {
  try {
      const ciudadanoData = req.body;
      const nuevoCiudadano = await personaService.createCiudadano(ciudadanoData);
      res.status(201).json(nuevoCiudadano);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


exports.createAdmin = async (req, res) => {
  try {
      const adminData = req.body;
      const nuevoAdmin = await personaService.createAdmin(adminData);
      res.status(201).json(nuevoAdmin);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


exports.createPolicia = async (req, res) => {
  try {
      const policiaData = req.body;
      const nuevoPolicia = await personaService.createPolicia(policiaData);
      res.status(201).json(nuevoPolicia);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


exports.getCiudadanoUser = async (req, res) => {
  const { id } = req.params;
  try {
      const ciudadano = await personaService.getCiudadanoUser(id);
      res.status(200).json(ciudadano);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// actualizar contrasenas
exports.verificarContrasena = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.params, req.body); // <-- Verificar qué llega

    let { id_persona } = req.params; // <-- Extraer el ID desde la URL
    let { contrasena } = req.body;

    // Validar si id_persona es un número válido
    id_persona = parseInt(id_persona, 10);
    if (isNaN(id_persona)) {
      return res.status(400).json({ error: "El ID de la persona debe ser un número válido." });
    }

    const resultado = await personaService.verificarContrasena({
      id_persona,
      contrasena,
    });

    if (resultado.valida) {
      res.json({ mensaje: "Contraseña correcta" });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error verificando contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.actualizarContrasena = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.params, req.body); // <-- Verificar qué llega

    let { id_persona } = req.params; // <-- Extraer el ID desde la URL
    let { nuevaContrasena } = req.body;

    // Validar si id_persona es un número válido
    id_persona = parseInt(id_persona, 10);
    if (isNaN(id_persona)) {
      return res.status(400).json({ error: "El ID de la persona debe ser un número válido." });
    }

    const resultado = await personaService.actualizarContrasena({ id_persona, nuevaContrasena });
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
