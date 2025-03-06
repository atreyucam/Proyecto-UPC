// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Persona, Rol, PersonaRol } = require('../models/db_models'); // Asegúrate de tener los modelos correctos

const authService = require('../services/srv_auth');
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
  try {
    const { email, password } = req.body;
    console.log("📩 Recibiendo solicitud de login:");
    console.log("Email:", email);
    console.log("Contraseña ingresada:", password);

    const response = await authService.login(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};




// 🔹 Nuevos métodos

exports.sendVerificationEmail = async (req, res) => {
  try {
    const response = await authService.sendVerificationEmail(req.body.email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await authService.verifyEmail(email, otp);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await authService.verifyEmail(token);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const response = await authService.sendPasswordResetEmail(req.body.email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
