const { Subtipo, TipoSolicitud } = require('../models/db_models');

// Crear Subtipo --V
exports.createSubtipoForTipo = async (req, res) => {
    const { id_tipo } = req.params; // ID del TipoSolicitud
    const { descripcion } = req.body; // Descripción del nuevo Subtipo
  
    try {
      // Verificar si el TipoSolicitud existe
      const tipo = await TipoSolicitud.findByPk(id_tipo);
      if (!tipo) {
        return res.status(404).json({ error: 'TipoSolicitud no encontrado' });
      }
  
      // Crear nuevo Subtipo
      const nuevoSubtipo = await Subtipo.create({
        id_tipo,
        descripcion
      });
  
      res.status(201).json(nuevoSubtipo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Obtener todos los Subtipos --V
exports.getAllSubtipos = async (req, res) => {
  try {
    const subtipos = await Subtipo.findAll();
    res.status(200).json(subtipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener Subtipo por ID --V
exports.getSubtipoById = async (req, res) => {
  try {
    const subtipo = await Subtipo.findByPk(req.params.id_subtipo);
    if (subtipo) {
      res.status(200).json(subtipo);
    } else {
      res.status(404).json({ error: 'Subtipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar Subtipo --V
// Aqui podemos actualizar hasta de que tipo es, siempre revisando que exista el tipo de solicitud
exports.updateSubtipo = async (req, res) => {
  try {
    const [updated] = await Subtipo.update(req.body, { where: { id_subtipo: req.params.id_subtipo } });
    if (updated) {
      const updatedSubtipo = await Subtipo.findByPk(req.params.id_subtipo);
      res.status(200).json(updatedSubtipo);
    } else {
      res.status(404).json({ error: 'Subtipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar Subtipo --V
exports.deleteSubtipo = async (req, res) => {
  try {
    const deleted = await Subtipo.destroy({ where: { id_subtipo: req.params.id_subtipo } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Subtipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
