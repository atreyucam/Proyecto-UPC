// routes/usuarioRoutes.js
import { Router } from "express";
import upload from "../config/multerConfig.js";

//Middlewares
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

//importaciones de controlador
import {
  getAllUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController.js";

const router = Router();

// Definición de rutas

// Obtener todos los usuarios
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getAllUsuarios);

// Crear un nuevo usuario con imagen
//router.post("/", upload.single("imagen"), createUsuario);
router.post("/", createUsuario);

// Obtener un usuario por ID
router.get("/:id_usuario", authMiddleware, getUsuarioById);

// Actualizar un usuario por ID
router.put("/:id_usuario", authMiddleware, updateUsuario);

// Eliminar un usuario por ID
router.delete(
  "/:id_usuario",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteUsuario
);

export default router;
