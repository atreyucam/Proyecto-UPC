import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { secret } from "../config/config.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña inválida" });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
      secret,
      { expiresIn: "1h" }
    );
    // Return the token and user data
    res.status(200).json({
      token,
      user: {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        cedula: usuario.cedula,
        imagen: usuario.imagen,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token inválido" });
    }
    req.usuario = decoded;
    next();
  });
};
