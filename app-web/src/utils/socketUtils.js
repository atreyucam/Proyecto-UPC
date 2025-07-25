import axios from "axios";
  const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;


/**
 * Maneja la actualización de una solicitud cuando llega por socket.
 * Consulta la API para obtener los detalles completos antes de actualizar el estado.
 */
export const handleSocketUpdate = async (solicitud, setSolicitudes) => {
  try {
    const response = await axios.get(
      `${API_URL}/solicitud/${solicitud.id_solicitud}`
    );
    const solicitudCompleta = response.data;

    if (solicitudCompleta.estado === "Pendiente") {
      setSolicitudes((prev) => [...prev, solicitudCompleta]); // 🔥 React detecta el cambio
    }
  } catch (error) {
    console.error("Error al obtener detalles de la solicitud", error);
  }
};

/**
 * Elimina una solicitud si su estado cambia (por ejemplo, si deja de estar "Pendiente").
 */
export const actualizarEstadoEnUI = (data, setSolicitudes) => {
  setSolicitudes((prevSolicitudes) =>
    prevSolicitudes.filter((solicitud) => solicitud.id_solicitud !== data.id_solicitud)
  );
};
