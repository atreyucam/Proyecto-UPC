import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Cambia aquí el puerto a 10000
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
