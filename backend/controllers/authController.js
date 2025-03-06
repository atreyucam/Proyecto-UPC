// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Persona, Rol, PersonaRol } = require('../models/db_models'); // Asegúrate de tener los modelos correctos

const authService = require('./services/srv_auth');
const nodemailer = require("nodemailer");

const verificationCodes = {};

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generar un código de 4 dígitos
const generateCode = () => Math.floor(1000 + Math.random() * 9000);

// Enviar código al correo
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Persona.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const code = generateCode();
    verificationCodes[email] = { code, expires: Date.now() + 1000000 }; // 5 min

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      text: `Tu código de recuperación es: ${code}`,
    });

    res.json({ message: "Código enviado al correo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verificar código y cambiar contraseña
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const storedData = verificationCodes[email];
    if (!storedData || storedData.code !== parseInt(code) || Date.now() > storedData.expires) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Persona.update({ password: hashedPassword }, { where: { email } });

    delete verificationCodes[email];
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
