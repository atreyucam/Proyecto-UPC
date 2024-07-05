import { Router } from "express";

// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Importaciones de controlador
import {
  createTipoDenuncia,
  getAllTiposDenuncia,
  getTipoDenunciaById,
  updateTipoDenuncia,
  deleteTipoDenuncia,
} from "../controllers/tipoDenunciaController.js";

const router = Router();

// Definición de rutas

// Obtener todos los tipos de denuncia
router.get("/", authMiddleware, getAllTiposDenuncia);

// Crear un nuevo tipo de denuncia
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTipoDenuncia);

// Obtener un tipo de denuncia por su ID
router.get("/:id_tipo_denuncia", authMiddleware, getTipoDenunciaById);

// Actualizar un tipo de denuncia por su ID
router.put(
  "/:id_tipo_denuncia",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateTipoDenuncia
);

// Eliminar un tipo de denuncia por su ID
router.delete(
  "/:id_tipo_denuncia",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteTipoDenuncia
);

export default router;
