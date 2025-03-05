// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Persona, Rol, PersonaRol } = require('../models/db_models'); // Asegúrate de tener los modelos correctos

const authService = require('./services/srv_auth');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const persona = await Persona.findOne({
      where: { email },
      include: {
        model: Rol,
        through: PersonaRol,
        attributes: ['id_rol', 'descripcion']
      }
    });

    if (!persona) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, persona.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const roles = persona.Rols.map(rol => rol.id_rol); // Obtener todos los roles del usuario

    // Generar token JWT
    const expiresIn = 3600; // 1 hora en segundos
    const token = jwt.sign(
      { id_persona: persona.id_persona, roles }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );
    const expirationTime = Date.now() + expiresIn * 1000; // Tiempo de expiración en milisegundos
    res.json({
      token,
      expiresIn: expirationTime, // Devuelve el tiempo exacto en que expira el token
      user: {
        id_persona: persona.id_persona,
        email: persona.email,
        roles
      }
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error.message, error.stack);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
  
};




exports.getAuthenticatedUser = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = await authService.getAuthenticatedUser(token);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return res.json({ message: 'Se ha enviado un código de recuperación a tu correo' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Endpoint para restablecer la contraseña usando el código
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    await authService.resetPassword(email, code, newPassword);
    return res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ message: error.message });
  }
};

