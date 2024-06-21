import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import { getAllProvincias } from "../controllers/provinciaController.js";
import {
  getAllCiudades,
  getCiudadByProvinciaId,
} from "../controllers/ciudadController.js";

const router = Router();

router.get("/ciudades", authMiddleware, getAllCiudades); // Obtener todos los roles
router.get("/provincias", authMiddleware, getAllProvincias); // Obtener todos los roles
router.get(
  "/ciudades_por_provincia/:id_provincia",
  authMiddleware,
  getCiudadByProvinciaId
);
export default router;
