import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Forzar uso de WebSockets
});

export default socket;
