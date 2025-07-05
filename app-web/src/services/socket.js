import { io } from "socket.io-client";

const socket = io("wss://upc-test.duckdns.org/socket.io", {
  transports: ["websocket"],
});

export default socket;
