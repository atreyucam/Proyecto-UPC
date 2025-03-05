// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Persona, Rol, PersonaRol } = require('../models/db_models'); // Asegúrate de tener los modelos correctos

const authService = require('../services/srv_auth');

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

exports.resetPassword = async (req, res) => {
  try {
    const response = await authService.resetPassword(req.body);
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
