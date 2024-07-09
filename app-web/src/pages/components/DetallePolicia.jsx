import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PoliciaDetail = () => {
  const { id } = useParams();
  const [policia, setPolicia] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicia = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/policias/${id}`
        );
        setPolicia(response.data);
      } catch (error) {
        console.error("Error fetching policia details", error);
      }
    };

    // Datos ficticios para el historial
    const fakeHistorial = [
      {
        id_historial: 1,
        nombre: "Juan",
        apellido: "Pérez",
        tipo: "Robo",
        duracion: "2 semanas",
        estado: "Abierto",
        descripcion: "Robo de un vehículo.",
      },
      {
        id_historial: 2,
        nombre: "Carlos",
        apellido: "García",
        tipo: "Asalto",
        duracion: "1 mes",
        estado: "Cerrado",
        descripcion: "Asalto a mano armada.",
      },
    ];

    setHistorial(fakeHistorial);

    fetchPolicia();
  }, [id]);

  const handleHistorialClick = async (idHistorial) => {
    const selected = historial.find((hist) => hist.id_historial === idHistorial);
    setSelectedHistorial(selected);
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
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4">
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
            <strong>Provincia:</strong> {policia.Circuito.provincia}
          </p>
          <p>
            <strong>Ciudad:</strong> {policia.Circuito.ciudad}
          </p>
          <p>
            <strong>Barrio:</strong> {policia.Circuito.barrio}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 mt-4">Historial</h3>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md mb-6">
        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-2">Nombre y Apellidos</th>
              <th className="border-b p-2">Tipo de Denuncia</th>
              <th className="border-b p-2">Duración</th>
              <th className="border-b p-2">Estado</th>
              <th className="border-b p-2">Descripción</th>
              <th className="border-b p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((entry, index) => (
              <tr
                key={index}
                className="text-center cursor-pointer hover:bg-gray-200"
                onClick={() => handleHistorialClick(entry.id_historial)}
              >
                <td className="border-b p-2">{`${entry.nombre} ${entry.apellido}`}</td>
                <td className="border-b p-2">{entry.tipo}</td>
                <td className="border-b p-2">{entry.duracion}</td>
                <td className="border-b p-2">{entry.estado}</td>
                <td className="border-b p-2">{entry.descripcion}</td>
                <td className="border-b p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistorialClick(entry.id_historial);
                    }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedHistorial && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md grid grid-cols-2 gap-4">
          <h3 className="text-lg font-bold mb-2 col-span-2">Detalles del Historial</h3>
          <div>
            <p>
              <strong>Nombre y Apellidos:</strong> {`${selectedHistorial.nombre} ${selectedHistorial.apellido}`}
            </p>
            <p>
              <strong>Cédula:</strong> {policia.cedula}
            </p>
            <p>
              <strong>Teléfono:</strong> {policia.telefono}
            </p>
            <p>
              <strong>Tipo de Denuncia:</strong> {selectedHistorial.tipo}
            </p>
          </div>
          <div>
            <p>
              <strong>Duración:</strong> {selectedHistorial.duracion}
            </p>
            <p>
              <strong>Estado:</strong> {selectedHistorial.estado}
            </p>
            <p>
              <strong>Descripción:</strong> {selectedHistorial.descripcion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliciaDetail;
