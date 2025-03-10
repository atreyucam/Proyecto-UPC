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
      include: [
        {
          model: Rol,
          as: "roles", // ✅ Asegurar que coincide con la relación en el modelo
          attributes: ["id_rol", "descripcion"],
          through: { attributes: [] }, // ✅ No traer la tabla intermedia
        }
      ]
    });

    if (!persona) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, persona.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Si no tiene roles asignados, aseguramos que siempre es un array vacío
    const roles = persona.roles ? persona.roles.map(rol => rol.id_rol) : [];

    // ✅ Generar token JWT
    const expiresIn = 3600; // 1 hora en segundos
    const token = jwt.sign(
      { id_persona: persona.id_persona, roles }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );

    res.json({
      token,
      expiresIn, 
      user: {
        id_persona: persona.id_persona,
        email: persona.email,
        roles
      }
    });
  } catch (error) {
    console.error("Error en el proceso de login:", error.message);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};



exports.getAuthenticatedUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("📢 Token recibido en backend:", token);

    if (!token) throw new Error("No se proporcionó un token");

    const user = await authService.getAuthenticatedUser(token);
    res.json(user);
  } catch (error) {
    console.error("❌ Error en getAuthenticatedUser:", error.message);
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

