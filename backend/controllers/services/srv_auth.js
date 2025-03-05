// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Persona, Rol, PersonaRol } = require('../../models/db_models');
const transporter = require('../../config/emailConfig');

// Objeto global para almacenar los códigos de reseteo temporalmente
// Estructura: { [email]: { code: '1234', expiration: timestamp } }
const resetCodes = {};

/**
 * Envía un código de 4 dígitos al correo del usuario y lo almacena temporalmente en memoria.
 * @param {string} email 
 */
exports.forgotPassword = async (email) => {
  // Buscar al usuario por email
  const persona = await Persona.findOne({ where: { email } });
  if (!persona) {
    throw new Error('No existe un usuario con ese email');
  }

  // Generar un código de 4 dígitos
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  // Establecer expiración para 1 hora
  const expiration = Date.now() + 60 * 60 * 1000; // 1 hora en milisegundos

  // Guardar el código en el objeto global
  resetCodes[email] = { code, expiration };

  // Configurar el correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de recuperación de contraseña',
    html: `
      <h3>Recuperación de contraseña</h3>
      <p>Tu código de recuperación es: <strong>${code}</strong></p>
      <p>Este código expira en 1 hora.</p>
    `
  };

  // Enviar el correo
  await transporter.sendMail(mailOptions);

  return true;
};

/**
 * Verifica el código enviado y actualiza la contraseña del usuario.
 * @param {string} email 
 * @param {string} code 
 * @param {string} newPassword 
 */
exports.resetPassword = async (email, code, newPassword) => {
  // Verificar que el código exista para ese email
  if (!resetCodes[email]) {
    throw new Error('Código inválido o no solicitado');
  }
  const { code: storedCode, expiration } = resetCodes[email];
  // Verificar expiración
  if (Date.now() > expiration) {
    delete resetCodes[email];
    throw new Error('El código ha expirado');
  }
  // Verificar que el código coincida
  if (code !== storedCode) {
    throw new Error('Código incorrecto');
  }

  // Buscar al usuario para actualizar la contraseña
  const persona = await Persona.findOne({ where: { email } });
  if (!persona) {
    throw new Error('Usuario no encontrado');
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  persona.password = hashedPassword;
  await persona.save();

  // Limpiar el código de reseteo
  delete resetCodes[email];

  return true;
};

/**
 * Función ya existente para obtener el usuario autenticado.
 */
exports.getAuthenticatedUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const persona = await Persona.findOne({
      where: { id_persona: decoded.id_persona },
      include: {
        model: Rol,
        through: PersonaRol,
        attributes: ['id_rol', 'descripcion']
      }
    });

    if (!persona) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id_persona: persona.id_persona,
      email: persona.email,
      roles: persona.Rols.map((rol) => rol.id_rol),
    };
  } catch (error) {
    throw new Error('Token no válido');
  }
};
