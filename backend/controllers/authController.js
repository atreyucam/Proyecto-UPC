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
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
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
