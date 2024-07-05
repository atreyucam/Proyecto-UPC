import { Router } from "express";
import upload from "../config/multerConfig.js"; // Si necesitas subir archivos, utiliza multer o el middleware adecuado

// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Importaciones de controlador
import {
  getAllDenuncias,
  createDenuncia,
  getDenunciaById,
  updateDenuncia,
  deleteDenuncia,
} from "../controllers/denunciaController.js";

const router = Router();

// Definición de rutas

// Obtener todas las denuncias
router.get("/", authMiddleware, getAllDenuncias);

// Crear una nueva denuncia
// Ejemplo utilizando multer para subir archivos (si es necesario)
router.post("/", upload.single("archivo"), createDenuncia);
//router.post("/", createDenuncia);

// Obtener una denuncia por su ID
router.get("/:id_denuncia", authMiddleware, getDenunciaById);

// Actualizar una denuncia por su ID
router.put("/:id_denuncia", authMiddleware, updateDenuncia);

// Eliminar una denuncia por su ID
router.delete("/:id_denuncia", authMiddleware, deleteDenuncia);

export default router;
