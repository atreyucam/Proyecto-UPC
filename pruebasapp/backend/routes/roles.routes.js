import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createRol,
  getAllRoles,
  getRolById,
  updateRol,
  deleteRol,
} from "../controllers/rolController.js"; // Importa el controlador correspondiente
import { getRolesForUser } from "../controllers/usuario_rol_Controller.js";

const router = Router();

// GET all categories
router.get("/", authMiddleware, getAllRoles);

// GET category by ID
router.get(
  "/:id_rol",
  authMiddleware,
  roleMiddleware("SUPERADMIN"),
  getRolById
);

// POST create a new category
router.post("/", authMiddleware, roleMiddleware("SUPERADMIN"), createRol);

// PUT update a category
router.put("/:id_rol", authMiddleware, roleMiddleware("SUPERADMIN"), updateRol);

// DELETE a category
router.delete(
  "/:id_rol",
  authMiddleware,
  roleMiddleware("SUPERADMIN"),
  deleteRol
);

// GET roles asignados a un usuario
router.get(
  "/usuario_roles/usuario/:id_usuario/roles",
  authMiddleware,
  roleMiddleware("SUPERADMIN"),
  getRolesForUser
);

export default router;
