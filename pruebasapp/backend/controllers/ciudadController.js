import Ciudad from "../models/Ciudad.js";

// Controlador para obtener todas las categorías
async function getAllCiudades(req, res) {
  try {
    const ciudades = await Ciudad.findAll();
    res.status(200).json(ciudades);
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getCiudadByProvinciaId(req, res) {
  const { id_provincia } = req.params;

  try {
    const ciudades = await Ciudad.findAll({
      where: { id_provincia: id_provincia },
    });
    res.status(200).json(ciudades);
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
export { getAllCiudades, getCiudadByProvinciaId };
