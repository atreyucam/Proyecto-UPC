// middlewares/roleMiddleware.js

import { ROL } from "../config/CONSTANTES.js";

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRoleId = req.user.id_rol; // Suponiendo que el rol del usuario está en req.user.id_rol
    const requiredRoleId = ROL.requiredRole;

    if (!requiredRoleId) {
      return res.status(500).json({ message: "Rol requerido no válido." });
    }

    if (userRoleId !== requiredRoleId) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No tienes el rol adecuado." });
    }

    next();
  };
};

export default roleMiddleware;
