const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Persona, Rol, PersonaRol } = require("../models/db_models");

// 🔹 Configuración del transporte de correos
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: process.env.MAIL_PORT == 465, // true para SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 🔹 Generar código OTP
const generateOTP = () => crypto.randomBytes(3).toString("hex").toUpperCase(); // Código de 6 caracteres

// 🔹 Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id_persona: user.id_persona, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// 🔹 Servicio de autenticación: login
exports.login = async (email, password) => {
  const persona = await Persona.findOne({
    where: { email },
    include: {
      model: Rol,
      through: PersonaRol,
      attributes: ["id_rol", "descripcion"],
    },
  });

  if (!persona) throw new Error("Usuario no encontrado");

  if (!persona.verified) throw new Error("Correo no verificado. Revisa tu email.");

  const validPassword = await bcrypt.compare(password, persona.password);
  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  // Extraer roles del usuario
  const roles = persona.Rols.map((rol) => rol.id_rol);

  return {
    token: generateToken({ id_persona: persona.id_persona, roles }),
    user: {
      id_persona: persona.id_persona,
      email: persona.email,
      roles,
    },
  };
};
// 🔹 Enviar código OTP para verificar el correo
exports.sendVerificationEmail = async (email) => {
  const user = await Persona.findOne({ where: { email } });
  if (!user) throw new Error("Correo no registrado");

  if (user.verified) throw new Error("El correo ya está verificado.");

  const otpCode = generateOTP();
  user.verificationCode = otpCode;
  user.verificationExpires = Date.now() + 10 * 60 * 1000; // Expira en 10 minutos
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verificación de cuenta",
    text: `Tu código de verificación es: ${otpCode}.`,
  };

  await transporter.sendMail(mailOptions);
  return { message: "Correo de verificación enviado" };
};

// 🔹 Verificar código OTP
exports.verifyEmail = async (email, otp) => {
  const user = await Persona.findOne({ where: { email } });

  if (!user) throw new Error("Usuario no encontrado");

  if (user.verified) throw new Error("El usuario ya está verificado.");

  if (user.verificationCode !== otp) throw new Error("Código de verificación incorrecto.");

  if (Date.now() > user.verificationExpires) throw new Error("El código ha expirado.");

  user.verified = true;
  user.verificationCode = null;
  user.verificationExpires = null;
  await user.save();

  return { message: "Cuenta verificada con éxito." };
};

// 🔹 Recuperación de contraseña con OTP
exports.sendPasswordResetEmail = async (email) => {
  const user = await Persona.findOne({ where: { email } });
  if (!user) throw new Error("Correo no registrado");

  const resetToken = crypto.randomBytes(6).toString("hex").toUpperCase();
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Tu código de recuperación es: ${resetToken}`,
  };
  await transporter.sendMail(mailOptions);
  return { message: "Código de recuperación enviado al correo" };
};

// 🔹 Restablecer contraseña con OTP
exports.resetPassword = async ({ email, resetToken, newPassword }) => {
  const user = await Persona.findOne({ where: { email, resetToken } });
  if (!user || user.resetTokenExpires < Date.now())
    throw new Error("Código inválido o expirado");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  return { message: "Contraseña restablecida con éxito" };
};


exports.getAuthenticatedUser = async (token) => {
  try {
    // console.log("📢 Token recibido para verificar:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Token decodificado:", decoded);

    const user = await Persona.findByPk(decoded.id_persona, {
      attributes: ["id_persona", "email"],
    });

    if (!user) throw new Error("Usuario no encontrado");

    return user;
  } catch (error) {
    console.error("❌ Error en getAuthenticatedUser:", error.message);
    throw new Error("Token inválido");
  }
};
