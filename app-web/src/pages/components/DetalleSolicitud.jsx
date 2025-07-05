import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import EstadoBadge from "./EstadoBadge";
  const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;



const DetalleSolicitud = () => {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/solicitud/${id}`
        );
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

  // Convertir puntoGPS a array si es necesario
  const puntoGPS = solicitud
    ? solicitud.puntoGPS.split(",").map(Number)
    : [0, 0];

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
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          {/* Información del Ciudadano */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-2">
              Información del Ciudadano
            </h3>
            <p>
              <strong>ID Ciudadano:</strong> {solicitud.creado_por.id_persona}
            </p>
            <p>
              <strong>Nombre:</strong>{" "}
              {`${solicitud.creado_por.nombres} ${solicitud.creado_por.apellidos}`}
            </p>
          </div>

          {/* Información de la Solicitud y Policía Asignado */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información de la Solicitud */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">
                Detalles de la Solicitud
              </h3>
              <p>
                <strong>Id Solicitud:</strong> {solicitud.id_solicitud}
              </p>
              <p>
                <strong>Tipo de Solicitud:</strong> {solicitud.tipo}
              </p>
              <p>
                <strong>Subtipo de Solicitud:</strong> {solicitud.subtipo}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(solicitud.fecha_creacion).toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <EstadoBadge estado={solicitud.estado} tipo="estado" />
              </p>
              <p>
                <strong>Punto GPS:</strong> {solicitud.puntoGPS}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {solicitud.direccion || "No disponible"}
              </p>
            </div>

            {/* Policía Asignado */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Policía Asignado</h3>
              {solicitud.policia_asignado ? (
                <>
                  <p>
                    <strong>ID Policía:</strong>{" "}
                    {solicitud.policia_asignado.id_persona}
                  </p>
                  <p>
                    <strong>Nombres:</strong>{" "}
                    {solicitud.policia_asignado.nombres}
                  </p>
                  <p>
                    <strong>Apellidos:</strong>{" "}
                    {solicitud.policia_asignado.apellidos}
                  </p>
                </>
              ) : (
                <p>No hay policía asignado</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mapa */}
      {solicitud && puntoGPS && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-2">Ubicación en el Mapa</h3>
          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
              center={puntoGPS}
              zoom={18}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={puntoGPS}>
                <Popup>{`Ubicación: ${puntoGPS}`}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      <h3 className="text-lg font-bold mb-2 mt-4">Historial</h3>
      {solicitud && solicitud.SolicitudEventoPersonas && (
        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-sm mb-6">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
                Item
              </th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
                Evento
              </th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
                Nombre Persona
              </th>
              <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitud.SolicitudEventoPersonas.map((evento, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.id_evento}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{`${evento.persona.nombres} ${evento.persona.apellidos}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(evento.fecha_creacion).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="text-lg font-bold mb-2 mt-4">Observaciones</h3>
      <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-sm">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
              Item
            </th>
            <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
              Observación
            </th>
            <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
              Nombre Persona
            </th>
            <th className="px-6 py-3 text-left text-sm text-gray-800 uppercase tracking-wider border-b p-2">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {solicitud &&
          solicitud.Observacions &&
          solicitud.Observacions.length > 0 ? (
            solicitud.Observacions.map((observacion, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {observacion.observacion}
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {`${observacion.persona.nombres} ${observacion.persona.apellidos}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(observacion.fecha).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center">
                No existen observaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DetalleSolicitud;

