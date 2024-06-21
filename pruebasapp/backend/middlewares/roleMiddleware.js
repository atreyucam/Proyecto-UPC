// middlewares/roleMiddleware.js
import roles from '../config/roles.js';

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRoleId = req.user.id_rol; // Suponiendo que el rol del usuario está en req.user.id_rol
    const requiredRoleId = roles[requiredRole];

    if (!requiredRoleId) {
      return res.status(500).json({ message: 'Rol requerido no válido.' });
    }

    if (userRoleId !== requiredRoleId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes el rol adecuado.' });
    }

    next();
  };
};

export default roleMiddleware;
