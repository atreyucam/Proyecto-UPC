// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para verificar JWT y rol de administrador
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // El token se espera en el header Authorization como: Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Verificar si el usuario tiene el rol de administrador (id_rol = 2)
    if (req.user.roles.includes(2)) {
      next();
    } else {
      return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden acceder' });
    }
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = authenticateJWT;
