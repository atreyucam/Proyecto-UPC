const { Rol } = require('../models/db_models');

// Crear un nuevo rol --V
exports.createRole = async (req, res) => {
  try {
    const rol = await Rol.create(req.body);
    res.status(201).json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los roles --V
exports.getAllRol = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un rol por ID --V
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Rol.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un rol --V
exports.updateRole = async (req, res) => {
  try {
    const [updated] = await Rol.update(req.body, { where: { id_rol: req.params.id } });
    if (updated) {
      const updatedRol = await Rol.findByPk(req.params.id);
      res.json(updatedRol);
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un rol --V
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await Rol.destroy({ where: { id_rol: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
