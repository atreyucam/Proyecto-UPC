const { Persona } = require('../models/db_models');

// Crear una nueva persona
exports.createPersona = async (req, res) => {
    try {
      const nuevaPersona = await Persona.create(req.body);
      res.status(201).json(nuevaPersona);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// Obtener todas las personas
exports.getAllPersona = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.status(200).json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una persona por ID
exports.getPersonaById = async (req, res) => {
  try {
    const { id } = req.params;
    const persona = await Persona.findByPk(id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.status(200).json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una persona
exports.updatePersona = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const persona = await Persona.findByPk(id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    persona.descripcion = descripcion;
    await persona.save();
    res.status(200).json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una Persona
exports.deletePersona = async (req, res) => {
  try {
    const { id } = req.params;
    const persona = await Persona.findByPk(id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    await persona.destroy();
    res.status(204).json({ message: 'Persona deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
