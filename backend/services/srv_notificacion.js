const admin = require("firebase-admin");
const { Persona, Rol } = require("../models/db_models");

// 🔹 Inicializar Firebase Admin SDK
const serviceAccount = require("../config/firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔹 Función para enviar notificaciones en tiempo real con Socket.io
exports.enviarNotificacionSocket = (io, usuarioId, titulo, mensaje) => {
  io.to(`usuario_${usuarioId}`).emit("nuevaNotificacion", { titulo, mensaje });
};

// 🔹 Función para enviar notificaciones push con Firebase
exports.enviarNotificacionPush = async (usuarioId, titulo, mensaje) => {
  const usuario = await Persona.findByPk(usuarioId);
  if (!usuario || !usuario.fcm_token) return;

  const message = {
    token: usuario.fcm_token,
    notification: {
      title: titulo,
      body: mensaje,
    },
    data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
  };

  try {
    await admin.messaging().send(message);
    console.log(`✅ Notificación enviada a ${usuario.email}`);
  } catch (error) {
    console.error("❌ Error al enviar notificación push:", error);
  }
};

// 🔹 Función para enviar notificación a múltiples usuarios
exports.enviarNotificacionUsuarios = async (io, usuariosIds, titulo, mensaje) => {
  for (const usuarioId of usuariosIds) {
    this.enviarNotificacionSocket(io, usuarioId, titulo, mensaje);
    await this.enviarNotificacionPush(usuarioId, titulo, mensaje);
  }
};

/**
 * 🔹 Notificar a todos los usuarios de un rol específico
 * @param {Object} io - Instancia de Socket.IO
 * @param {string} rolDescripcion - Nombre del rol (Ej: "Admin", "Policia")
 * @param {string} titulo - Título de la notificación
 * @param {string} mensaje - Contenido de la notificación
 */
exports.notificarUsuariosPorRol = async (io, rolDescripcion, titulo, mensaje) => {
  try {
      console.log(`🔍 Buscando usuarios con rol: ${rolDescripcion}...`);

      const usuarios = await Persona.findAll({
          include: [
              {
                  model: Rol,
                  where: { descripcion: rolDescripcion },
                  through: { attributes: [] },
              },
          ],
      });

      if (usuarios.length === 0) {
          console.warn(`⚠️ No se encontraron usuarios con el rol: ${rolDescripcion}`);
          return;
      }

      const userIds = usuarios.map((user) => user.id_persona);
      console.log(`✅ Usuarios encontrados con rol ${rolDescripcion}:`, userIds);

      io.emit("nuevaNotificacion", { userIds, titulo, mensaje });
      console.log(`📢 Notificación enviada: ${titulo} - ${mensaje}`);
  } catch (error) {
      console.error(`❌ Error al enviar notificación a ${rolDescripcion}:`, error);
  }
};


/**
* 🔹 Notificar a usuarios específicos
* @param {Object} io - Instancia de Socket.IO
* @param {Array} userIds - Lista de IDs de usuarios a notificar
* @param {string} titulo - Título de la notificación
* @param {string} mensaje - Contenido de la notificación
*/
exports.notificarUsuarios = async (io, userIds, titulo, mensaje) => {
  if (userIds.length > 0) {
      io.emit("nuevaNotificacion", { userIds, titulo, mensaje });
  }
};