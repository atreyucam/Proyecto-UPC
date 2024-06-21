import Rol from "../models/Rol.js";
import { rolSchema } from "../utils/validationSchemas.js";

// Controlador para crear un nuevo rol
async function createRol(req, res) {
  try {
    const { error, value } = rolSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { nombre, descripcion } = req.body;
    const nuevoRol = await Rol.create({ nombre, descripcion });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error("Error al crear un rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener todos los roles
async function getAllRoles(req, res) {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener un rol por su ID
async function getRolById(req, res) {
  const { id_rol } = req.params;
  try {
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar un rol por su ID
async function updateRol(req, res) {
  const { id_rol } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    await rol.update({ nombre, descripcion });
    res.status(200).json(rol);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para eliminar un rol por su ID
async function deleteRol(req, res) {
  const { id_rol } = req.params;
  try {
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    await rol.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export { createRol, getAllRoles, getRolById, updateRol, deleteRol };
