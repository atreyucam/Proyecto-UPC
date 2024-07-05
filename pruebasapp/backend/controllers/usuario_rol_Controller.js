import Usuario from "../models/Usuario.js";
import Rol from "../models/Rol.js";
import Usuario_rol from "../models/Usuario_rol.js";

async function assignRoleToUser(req, res) {
  try {
    const { id_usuario, id_rol } = req.body;

    // Verificar si el usuario y el rol existen
    const usuario = await Usuario.findByPk(id_usuario);
    const rol = await Rol.findByPk(id_rol);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Asignar el rol al usuario
    await Usuario_rol.create({ id_usuario, id_rol });

    res.status(201).json({ message: "Rol asignado al usuario exitosamente" });
  } catch (error) {
    console.error("Error al asignar rol al usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getRolesForUser(req, res) {
  try {
    const { id_usuario } = req.params;

    // Buscar roles asignados al usuario
    const roles = await Usuario_rol.findAll({
      where: { id_usuario },
      include: [Rol], // Incluir la información del modelo Rol relacionado
    });

    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error al obtener roles del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function updateRoleForUser(req, res) {
  try {
    const { id_usuario, id_rol } = req.body;

    // Verificar si el usuario y el rol existen
    const usuario = await Usuario.findByPk(id_usuario);
    const rol = await Rol.findByPk(id_rol);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Actualizar la asignación de rol existente
    await Usuario_rol.update(
      { id_rol },
      {
        where: { id_usuario },
      }
    );

    res
      .status(200)
      .json({ message: "Rol del usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar rol del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function removeRoleFromUser(req, res) {
  try {
    const { id_usuario } = req.params;

    // Eliminar la asignación de roles del usuario
    await Usuario_rol.destroy({
      where: { id_usuario },
    });

    res
      .status(200)
      .json({
        message: "Asignación de roles del usuario eliminada correctamente",
      });
  } catch (error) {
    console.error("Error al eliminar asignación de roles del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export {
  assignRoleToUser,
  getRolesForUser,
  updateRoleForUser,
  removeRoleFromUser,
};
