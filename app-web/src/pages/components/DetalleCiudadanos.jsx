import React, { useEffect, useState } from "react";
import {  FiEye } from 'react-icons/fi';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CiudadanoDetail = () => {
  const { id } = useParams();
  const [ciudadano, setCiudadano] = useState({});
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCiudadano = async () => {
      try {
        // Llamada a la API para obtener los detalles del ciudadano
        const response = await axios.get(
          `http://localhost:3000/personas/ciudadano/${id}`
        );
        setCiudadano(response.data);

        // Extraer y ordenar las solicitudes por fecha de creación
        const solicitudesOrdenadas = response.data.solicitudes_creadas
          .map(solicitud => ({
            id_solicitud: solicitud.id_solicitud,
            estado: solicitud.estado,
            subtipo: solicitud.subtipo,
            tipo_solicitud: solicitud.tipo_solicitud,
            fecha_creacion: new Date(solicitud.fecha_creacion),
            puntoGPS: solicitud.puntoGPS,
            observacion: solicitud.observacion
          }))
          .sort((a, b) => b.fecha_creacion - a.fecha_creacion); // Ordenar por fecha de creación

        setHistorial(solicitudesOrdenadas);
      } catch (error) {
        console.error("Error fetching ciudadano details", error);
        setError("No se encontraron datos para el ciudadano solicitado.");
      }
    };

    fetchCiudadano();
  }, [id]);

  const handleHistorialClick = (idSolicitud) => {
    const selected = historial.find((sol) => sol.id_solicitud === idSolicitud);
    navigate(`/solicitudes/${idSolicitud}`, { state: { solicitud: selected } });
  };

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
        <h1 className="text-2xl font-bold">Detalles del Ciudadano</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-2 border border-gray-200">
        <div>
          <p>
            <strong>Id:</strong> {ciudadano.id_persona}
          </p>
          <p>
            <strong>Cédula:</strong> {ciudadano.cedula}
          </p>
          <p>
            <strong>Nombres:</strong> {ciudadano.nombres}
          </p>
          <p>
            <strong>Apellidos:</strong> {ciudadano.apellidos}
          </p>
          <p>
            <strong>Teléfono:</strong> {ciudadano.telefono}
          </p>
        </div>
        <div>
          <p>
            <strong>Email:</strong> {ciudadano.email}
          </p>
          <p>
            <strong>Distrito:</strong> {ciudadano.nombre_distrito}
          </p>
          <p>
            <strong>Cantón:</strong> {ciudadano.nombre_canton}
          </p>
          <p>
            <strong>Subzona:</strong> {ciudadano.nombre_subzona}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 mt-4">Historial de Solicitudes</h3>
      <div className="overflow-x-auto shadow-sm">
        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-2">ID Solicitud</th>
              <th className="border-b p-2">Estado</th>
              <th className="border-b p-2">Subtipo</th>
              <th className="border-b p-2">Tipo de Solicitud</th>
              <th className="border-b p-2">Fecha de Creación</th>
              <th className="border-b p-2">Punto GPS</th>
              <th className="border-b p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((solicitud) => (
              <tr
                key={solicitud.id_solicitud}
                className="text-center cursor-pointer hover:bg-gray-200"
                onClick={() => handleHistorialClick(solicitud.id_solicitud)}
              >
                <td className="border-b p-2">{solicitud.id_solicitud}</td>
                <td className="border-b p-2">{solicitud.estado}</td>
                <td className="border-b p-2">{solicitud.subtipo}</td>
                <td className="border-b p-2">{solicitud.tipo_solicitud}</td>
                <td className="border-b p-2">{solicitud.fecha_creacion.toLocaleString()}</td>
                <td className="border-b p-2">{solicitud.puntoGPS}</td>
                <td className="border-b p-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => navigate(`/solicitud/${solicitud.id_solicitud}`, { state: { solicitud } })}
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CiudadanoDetail;
