import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EstadoBadge from "./EstadoBadge"; // Importa el componente

const PoliciaDetail = () => {
  const { id } = useParams();
  const [policia, setPolicia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicia = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/personas/policia/${id}`
        );
        setPolicia(response.data);
      } catch (error) {
        console.error("Error fetching policia details", error);
      }
    };

    fetchPolicia();
  }, [id]);

  const handleVerSolicitud = (idSolicitud) => {
    const selected = policia.solicitudes_asignadas.find(
      (sol) => sol.id_solicitud === idSolicitud
    );
    navigate(`/solicitudes/${idSolicitud}`, { state: { solicitud: selected } });
  };

  if (!policia) {
    return <div>Cargando...</div>;
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
        <h1 className="text-2xl font-bold">Detalles del Policía</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-2 border border-gray-200">
        <div>
          <p>
            <strong>Cédula:</strong> {policia.cedula}
          </p>
          <p>
            <strong>Nombres:</strong> {policia.nombres}
          </p>
          <p>
            <strong>Apellidos:</strong> {policia.apellidos}
          </p>
          <p>
            <strong>Teléfono:</strong> {policia.telefono}
          </p>
        </div>
        <div>
          <p>
            <strong>Email:</strong> {policia.email}
          </p>
          <p>
            <strong>Disponibilidad:</strong> {policia.disponibilidad}
          </p>
          <p>
            <strong>ID Circuito:</strong> {policia.id_circuito}
          </p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-4">
            Resumen de Solicitudes Asignadas
          </h3>
          <div className="overflow-x-auto shadow-sm">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border-b p-2 text-center">
                    Tipo de Solicitud
                  </th>
                  <th className="border-b p-2 text-center">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(policia.resumen_solicitudes_asignadas).map(
                  ([tipo, cantidad]) => (
                    <tr key={tipo} className="hover:bg-gray-50">
                      <td className="border-b p-2 text-center">{tipo}</td>
                      <td className="border-b p-2 text-center">{cantidad}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold mb-4">Total de Solicitudes</h3>
          <div className="overflow-x-auto shadow-sm mb-4">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border-b p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border-b p-2 text-center">
                    {policia.total_solicitudes}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold mb-4">Solicitud Más Resuelta</h3>
          <div className="overflow-x-auto shadow-sm">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border-b p-2 text-center">
                    Tipo de Solicitud
                  </th>
                  <th className="border-b p-2 text-center">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border-b p-2 text-center">
                    {policia.solicitud_mas_resuelta}
                  </td>
                  <td className="border-b p-2 text-center">
                    {
                      policia.resumen_solicitudes_asignadas[
                        policia.solicitud_mas_resuelta
                      ]
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Solicitudes Asignadas</h3>
      {policia.solicitudes_asignadas.length > 0 ? (
        <div className="overflow-x-auto shadow-sm">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="border-b p-2 text-center">ID Solicitud</th>
                <th className="border-b p-2 text-center">Estado</th>
                <th className="border-b p-2 text-center">Subtipo</th>
                <th className="border-b p-2 text-center">Tipo de Solicitud</th>
                <th className="border-b p-2 text-center">Fecha de Creación</th>
                <th className="border-b p-2 text-center">Punto GPS</th>
                <th className="border-b p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {policia.solicitudes_asignadas.map((solicitud) => (
                <tr key={solicitud.id_solicitud} className="hover:bg-gray-50">
                  <td className="border-b p-2 text-center">
                    {solicitud.id_solicitud}
                  </td>
                  <td className="border-b p-2 text-center">
                    <EstadoBadge estado={solicitud.estado} tipo="estado" />
                  </td>
                  <td className="border-b p-2 text-center">
                    {solicitud.subtipo}
                  </td>
                  <td className="border-b p-2 text-center">
                    {solicitud.tipo_solicitud}
                  </td>
                  <td className="border-b p-2 text-center">
                    {new Date(solicitud.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="border-b p-2 text-center">
                    {solicitud.puntoGPS}
                  </td>
                  <td className="border-b p-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleVerSolicitud(solicitud.id_solicitud)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-4">
          No se encontraron solicitudes asignadas.
        </p>
      )}
    </div>
  );
};

export default PoliciaDetail;
