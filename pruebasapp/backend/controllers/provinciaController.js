import Provincia from "../models/Provincia.js";

// Controlador para obtener todas las categorías
async function getAllProvincias(req, res) {
  try {
    const provincias = await Provincia.findAll();
    res.status(200).json(provincias);
  } catch (error) {
    console.error("Error al obtener las provincias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
export { getAllProvincias };
