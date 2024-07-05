import Denuncia from "../models/Denuncia.js";
import { denunciaSchema } from "../utils/validationSchemas.js"; // Importa el esquema de validación si es necesario

// Controlador para crear una nueva denuncia
async function createDenuncia(req, res) {
  try {
    const { error, value } = denunciaSchema.validate(req.body); // Validar si es necesario
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      id_tipo_denuncia,
      evidencia,
      descripcion,
      latitud,
      longitud,
      id_usuario,
      id_gestor,
      id_estado_denuncia,
    } = req.body;

    const nuevaDenuncia = await Denuncia.create({
      id_tipo_denuncia,
      evidencia,
      descripcion,
      latitud,
      longitud,
      fecha_inicio: new Date(),
      id_usuario,
      id_gestor,
      id_estado_denuncia,
    });

    res.status(201).json(nuevaDenuncia);
  } catch (error) {
    console.error("Error al crear una denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener todas las denuncias
async function getAllDenuncias(req, res) {
  try {
    const denuncias = await Denuncia.findAll();
    res.status(200).json(denuncias);
  } catch (error) {
    console.error("Error al obtener las denuncias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener una denuncia por su ID
async function getDenunciaById(req, res) {
  const { id_denuncia } = req.params;
  try {
    const denuncia = await Denuncia.findByPk(id_denuncia);
    if (!denuncia) {
      return res.status(404).json({ message: "Denuncia no encontrada" });
    }
    res.status(200).json(denuncia);
  } catch (error) {
    console.error("Error al obtener la denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar una denuncia por su ID
async function updateDenuncia(req, res) {
  const { id_denuncia } = req.params;
  const {
    id_tipo_denuncia,
    evidencia,
    descripcion,
    latitud,
    longitud,
    fecha_inicio,
    fecha_fin,
    id_usuario,
    id_gestor,
    id_estado_denuncia,
  } = req.body;

  try {
    const denuncia = await Denuncia.findByPk(id_denuncia);
    if (!denuncia) {
      return res.status(404).json({ message: "Denuncia no encontrada" });
    }

    await denuncia.update({
      id_tipo_denuncia,
      evidencia,
      descripcion,
      latitud,
      longitud,
      fecha_inicio,
      fecha_fin,
      id_usuario,
      id_gestor,
      id_estado_denuncia,
    });

    res.status(200).json(denuncia);
  } catch (error) {
    console.error("Error al actualizar la denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para eliminar una denuncia por su ID
async function deleteDenuncia(req, res) {
  const { id_denuncia } = req.params;
  try {
    const denuncia = await Denuncia.findByPk(id_denuncia);
    if (!denuncia) {
      return res.status(404).json({ message: "Denuncia no encontrada" });
    }

    await denuncia.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar la denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export {
  createDenuncia,
  getAllDenuncias,
  getDenunciaById,
  updateDenuncia,
  deleteDenuncia,
};
