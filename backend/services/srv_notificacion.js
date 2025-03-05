const admin = require("../config/firebase/firebaseConfig"); // 🔹 IMPORTA la instancia ya inicializada
const { Persona, Rol, Notificacion } = require("../models/db_models");
const { Op } = require("sequelize");

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

    // 📌 Guardar la notificación en la base de datos
    const nuevaNotificacion = await Notificacion.create({
      notificacion: mensaje,
      fecha_tiempo_creacion: new Date(), // Guardar fecha exacta
    });

    // 📌 Emitir evento con la fecha de creación
    io.emit("nuevaNotificacion", {
      userIds,
      titulo,
      mensaje,
      fecha_tiempo_creacion: nuevaNotificacion.fecha_tiempo_creacion, // Asegurar que se envía
    });

    console.log(`📢 Notificación enviada y guardada: ${titulo} - ${mensaje} - 📅 ${nuevaNotificacion.fecha_tiempo_creacion}`);
  } catch (error) {
    console.error(`❌ Error al enviar notificación a ${rolDescripcion}:`, error);
  }
};


/**
 * 🔹 Notificar a usuarios específicos
 */
exports.notificarUsuarios = async (io, userIds, titulo, mensaje) => {
  if (userIds.length > 0) {
    io.to(userIds).emit("nuevaNotificacion", { titulo, mensaje, timestamp: new Date() });
  } else {
    io.emit("nuevaNotificacion", { titulo, mensaje, timestamp: new Date() });
  }
};

// 🔹 Crear y emitir una notificación
exports.crearNotificacion = async (io, mensaje) => {
  try {
    // Guardar en la base de datos
    const nuevaNotificacion = await Notificacion.create({
      notificacion: mensaje,
      fecha_tiempo_creacion: new Date(), // Se almacena el timestamp exacto de creación
    });

    // Emitir la notificación a todos los usuarios conectados
    io.emit("nuevaNotificacion", {
      mensaje: nuevaNotificacion.notificacion,
      fecha_tiempo_creacion: nuevaNotificacion.fecha_tiempo_creacion,
    });

    console.log("🔔 Notificación enviada y guardada:", nuevaNotificacion.notificacion);
    return nuevaNotificacion;
  } catch (error) {
    console.error("❌ Error al crear la notificación:", error);
  }
};

// 🔹 Obtener todas las notificaciones recientes
exports.obtenerNotificaciones = async () => {
  try {
    const notificaciones = await Notificacion.findAll({
      order: [["id_notificacion", "DESC"]],
    });
    return notificaciones;
  } catch (error) {
    console.error("❌ Error al obtener las notificaciones:", error);
  }
};

// 🔹 Limpiar notificaciones antiguas (cron job)
const NOTIFICACION_EXPIRACION_DIAS = 30; // Define una constante para la expiración
exports.eliminarNotificacionesExpiradas = async () => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - NOTIFICACION_EXPIRACION_DIAS);

    const eliminadas = await Notificacion.destroy({
      where: {
        createdAt: { [Op.lt]: fechaLimite },
      },
    });

    console.log(`🗑️ Notificaciones antiguas eliminadas: ${eliminadas}`);
  } catch (error) {
    console.error("❌ Error eliminando notificaciones expiradas:", error);
  }
};
