import TipoDenuncia from "../models/TipoDenuncia.js";
import { tipoDenunciaSchema } from "../utils/validationSchemas.js";

// Controlador para crear un nuevo tipo de denuncia
async function createTipoDenuncia(req, res) {
  try {
    const { error, value } = tipoDenunciaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const nuevoTipoDenuncia = await TipoDenuncia.create(value);

    res.status(201).json(nuevoTipoDenuncia);
  } catch (error) {
    console.error("Error al crear un tipo de denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener todos los tipos de denuncia
async function getAllTiposDenuncia(req, res) {
  try {
    const tiposDenuncia = await TipoDenuncia.findAll();
    res.status(200).json(tiposDenuncia);
  } catch (error) {
    console.error("Error al obtener los tipos de denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener un tipo de denuncia por su ID
async function getTipoDenunciaById(req, res) {
  const { id_tipo_denuncia } = req.params;
  try {
    const tipoDenuncia = await TipoDenuncia.findByPk(id_tipo_denuncia);
    if (!tipoDenuncia) {
      return res
        .status(404)
        .json({ message: "Tipo de denuncia no encontrado" });
    }
    res.status(200).json(tipoDenuncia);
  } catch (error) {
    console.error("Error al obtener el tipo de denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar un tipo de denuncia por su ID
async function updateTipoDenuncia(req, res) {
  const { id_tipo_denuncia } = req.params;
  const { nombre } = req.body;
  try {
    const tipoDenuncia = await TipoDenuncia.findByPk(id_tipo_denuncia);
    if (!tipoDenuncia) {
      return res
        .status(404)
        .json({ message: "Tipo de denuncia no encontrado" });
    }
    await tipoDenuncia.update({ nombre });
    res.status(200).json(tipoDenuncia);
  } catch (error) {
    console.error("Error al actualizar el tipo de denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para eliminar un tipo de denuncia por su ID
async function deleteTipoDenuncia(req, res) {
  const { id_tipo_denuncia } = req.params;
  try {
    const tipoDenuncia = await TipoDenuncia.findByPk(id_tipo_denuncia);
    if (!tipoDenuncia) {
      return res
        .status(404)
        .json({ message: "Tipo de denuncia no encontrado" });
    }
    await tipoDenuncia.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar el tipo de denuncia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export {
  createTipoDenuncia,
  getAllTiposDenuncia,
  getTipoDenunciaById,
  updateTipoDenuncia,
  deleteTipoDenuncia,
};
