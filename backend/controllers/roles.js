const { Rol } = require('../models/db_models');

// Crear un nuevo rol
exports.createRole = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const newRole = await Rol.create({ descripcion });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los roles
exports.getAllRol = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un rol por ID
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

// Actualizar un rol
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const role = await Rol.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    role.descripcion = descripcion;
    await role.save();
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un rol
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Rol.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    await role.destroy();
    res.status(204).json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
