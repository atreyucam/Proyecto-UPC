const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }, // Restringir en producción
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    socket.on("registrarUsuario", (usuarioId) => {
      socket.join(`usuario_${usuarioId}`);
      console.log(`📢 Usuario ${usuarioId} registrado en su canal de notificaciones.`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado");
    });
  });

  return io;
};
