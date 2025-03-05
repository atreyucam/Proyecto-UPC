const express = require("express");
const router = express.Router();
const notificacionService = require("../services/srv_notificacion");

// Obtener todas las notificaciones
router.get("/", async (req, res) => {
  const notificaciones = await notificacionService.obtenerNotificaciones();
  res.json(notificaciones);
});

// Eliminar una notificación
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await notificacionService.eliminarNotificacion(id);
  res.status(204).send();
});

module.exports = router;
