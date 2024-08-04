import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DetalleSolicitud = () => {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/solicitud/${id}`);
        setSolicitud(response.data);
      } catch (error) {
        console.error("Error fetching solicitud details", error);
        setError("No se encontraron datos para la solicitud solicitada.");
      }
    };

    fetchSolicitud();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto px-3 py-8">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Regresar
        </button>
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-8">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate(-1)}
      >
        Regresar
      </button>

      <br />
      <br />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalles de la Solicitud</h1>
      </div>
      {solicitud && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          {/* Información del Ciudadano */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-2">Información del Ciudadano</h3>
            <p><strong>ID Solicitud:</strong> {solicitud.id_solicitud}</p>
            <p><strong>Cédula:</strong> {solicitud.creador?.cedula || "No disponible"}</p>
            <p><strong>Nombre:</strong> {`${solicitud.creador?.nombres || "No disponible"} ${solicitud.creador?.apellidos || "No disponible"}`}</p>
            <p><strong>telefono:</strong> {solicitud.creador?.telefono || "No disponible"}</p>
            <p><strong>email:</strong> {solicitud.creador?.email || "No disponible"}</p>
          </div>

          {/* Información de la Solicitud y Policía Asignado */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información de la Solicitud */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Detalles de la Solicitud</h3>
              <p><strong>Tipo de Solicitud:</strong> {solicitud.Subtipo.TipoSolicitud.descripcion}</p>
              <p><strong>Subtipo de Solicitud:</strong> {solicitud.Subtipo.descripcion}</p>
              <p><strong>Fecha de Creación:</strong> {new Date(solicitud.fecha_creacion).toLocaleString()}</p>
              <p><strong>Estado:</strong> {solicitud.id_estado}</p>
              <p><strong>Punto GPS:</strong> {solicitud.puntoGPS}</p>
              <p><strong>Dirección:</strong> {solicitud.direccion || "No disponible"}</p>
              <p><strong>Observación:</strong> {solicitud.observacion || "No disponible"}</p>
            </div>

            {/* Policía Asignado */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Policía Asignado</h3>
              {solicitud.policia_asignado.length > 0 ? (
                <div>
                  <p><strong>ID Policía:</strong> {solicitud.policia_asignado[0].id_persona}</p>
                  <p><strong>Cédula:</strong> {solicitud.policia_asignado[0].Persona.cedula}</p>
                  <p><strong>Nombres:</strong> {solicitud.policia_asignado[0].Persona.nombres}</p>
                  <p><strong>Apellidos:</strong> {solicitud.policia_asignado[0].Persona.apellidos}</p>
                  <p><strong>Teléfono:</strong> {solicitud.policia_asignado[0].Persona.telefono}</p>
                  <p><strong>Email:</strong> {solicitud.policia_asignado[0].Persona.email}</p>
                  <p><strong>Disponibilidad:</strong> {solicitud.policia_asignado[0].Persona.disponibilidad}</p>
                </div>
              ) : (
                <p>No hay policía asignado.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-bold mb-2 mt-4">Historial</h3>
      {solicitud && solicitud.eventos && (
        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Item</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Evento</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Nombre Persona</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitud.eventos.map((evento, index) => (
              <tr key={evento.id_evento}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{evento.evento}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${evento.Persona.nombres} ${evento.Persona.apellidos}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(evento.fecha_creacion).toLocaleString() }</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="text-lg font-bold mb-2 mt-4">Observaciones</h3>
      {solicitud && solicitud.observaciones && (
        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Item</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Observación</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Nombre Persona</th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitud.observaciones.map((observacion, index) => (
              <tr key={observacion.id_observacion}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{observacion.observacion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${observacion.Persona.nombres} ${observacion.Persona.apellidos}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(observacion.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DetalleSolicitud;
