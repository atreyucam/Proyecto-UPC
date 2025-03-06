const axios = require("axios");
const https = require("https");
const crypto = require("crypto");

// 🔧 Agente HTTPS con compatibilidad de renegociación legacy SOLO para ESPOCH
const espochAgent = new https.Agent({
  rejectUnauthorized: false, // Ignora la verificación SSL
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT, // Habilita renegociación legacy
});

// 🌐 Función para obtener datos de la API de ESPOCH con validación de respuesta
exports.fetchPersonaDataFromESPOCH = async (cedula) => {
  try {
    const url = `${process.env.ESPOCH_API_URL}/${cedula}`;
    console.log(`🔍 Consultando API ESPOCH: ${url}`);

    const response = await axios.get(url, {
      httpsAgent: espochAgent, // Usa el agente HTTPS configurado solo para esta API
      headers: {
        "User-Agent": "Mozilla/5.0", // Simula ser un navegador
      },
      timeout: 10000, // Aumenta el tiempo de espera
    });

    // ✅ Si la respuesta es exitosa, retorna los datos
    if (response.data.success) {
      console.log("✅ Respuesta de ESPOCH:", response.data);
      return response.data.listado[0];
    }

    // ❌ Si no encuentra la cédula, devuelve el mensaje exacto sin errores adicionales
    console.log("❌ Cédula no encontrada en ESPOCH.");
    throw new Error("No se ha encontrado información en la Dinardap");

  } catch (error) {
    // 🚨 Si el error proviene de la API (cédula no encontrada), enviar solo ese mensaje
    if (error.message.includes("No se ha encontrado información en la Dinardap")) {
      throw error;
    }

    // ❌ Si el error es otro (problema con la API), dar un mensaje genérico
    console.error("❌ Error al consultar API ESPOCH:", error.message);
    throw new Error("Error consultando API externa");
  }
};
