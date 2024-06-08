const { TipoSolicitud, Subtipo, sequelize } = require('../models/db_models');

// Crear TipoSolicitud --V
// exports.createTipoSolicitud = async (req, res) => {
//   try {
//     const nuevoTipo = await TipoSolicitud.create(req.body);
//     res.status(201).json(nuevoTipo);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Crear TipoSolicitud con Subtipos --V
exports.createTipoSolicitudWithSubtipos = async (req, res) => {
    const { descripcion, subtipos } = req.body;
  
    const transaction = await sequelize.transaction();
  
    try {
      // Crear TipoSolicitud
      const nuevoTipo = await TipoSolicitud.create({ descripcion }, { transaction });
  
      // Crear Subtipos
      for (const subtipo of subtipos) {
        await Subtipo.create({
          id_tipo: nuevoTipo.id_tipo,
          descripcion: subtipo.descripcion
        }, { transaction });
      }
  
      await transaction.commit();
      res.status(201).json(nuevoTipo);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  };


// Obtener todos los TiposSolicitud --V
exports.getAllTipoSolicitud = async (req, res) => {
  try {
    const tipos = await TipoSolicitud.findAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener TipoSolicitud por ID --V
exports.getTipoSolicitudById = async (req, res) => {
  try {
    const tipo = await TipoSolicitud.findByPk(req.params.id_tipo);
    if (tipo) {
      res.status(200).json(tipo);
    } else {
      res.status(404).json({ error: 'TipoSolicitud no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar TipoSolicitud --V
exports.updateTipoSolicitud = async (req, res) => {
  try {
    const [updated] = await TipoSolicitud.update(req.body, { where: { id_tipo: req.params.id_tipo } });
    if (updated) {
      const updatedTipo = await TipoSolicitud.findByPk(req.params.id_tipo);
      res.status(200).json(updatedTipo);
    } else {
      res.status(404).json({ error: 'TipoSolicitud no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar TipoSolicitud --V
exports.deleteTipoSolicitud = async (req, res) => {
  try {
    const deleted = await TipoSolicitud.destroy({ where: { id_tipo: req.params.id_tipo } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'TipoSolicitud no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
