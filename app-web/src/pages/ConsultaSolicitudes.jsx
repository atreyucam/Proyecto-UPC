import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiTrash, FiEye } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const ConsultaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [solicitudToDelete, setSolicitudToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/solicitud/");
        setSolicitudes(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (solicitud) => {
    setShowDeleteModal(true);
    setSolicitudToDelete(solicitud);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/solicitud/${solicitudToDelete.id_solicitud}`);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((s) => s.id_solicitud !== solicitudToDelete.id_solicitud)
      );
      setShowDeleteModal(false);
      setSolicitudToDelete(null);
    } catch (error) {
      console.error("Error deleting solicitud", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSolicitudToDelete(null);
  };

  const handleRowClick = (solicitud) => {
    navigate(`/solicitudes/${solicitud.id_solicitud}`);
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de solicitudes</h1>

      {/* Sección que muestra el conteo de solicitudes */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes registradas"
            number={solicitudes.length}
            icon={<FiCheckCircle size={28} />}
            onClick={() => console.log("Botón solicitudes presionado")}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Solicitudes</h2>
        {solicitudes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border-b p-2">ID Solicitud</th>
                  <th className="border-b p-2">Estado</th>
                  <th className="border-b p-2">Tipo</th>
                  <th className="border-b p-2">Subtipo</th>
                  <th className="border-b p-2">Fecha de Creación</th>
                  <th className="border-b p-2">Policía Asignado</th>
                  <th className="border-b p-2">Ciudad</th>
                  <th className="border-b p-2">Barrio</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id_solicitud} className="hover:bg-gray-50">
                    <td className="border-b p-2 text-center">{solicitud.id_solicitud}</td>
                    <td className="border-b p-2 text-center">{solicitud.estado}</td>
                    <td className="border-b p-2 text-center">{solicitud.tipo}</td>
                    <td className="border-b p-2 text-center">{solicitud.subtipo}</td>
                    <td className="border-b p-2 text-center">{new Date(solicitud.fecha_creacion).toLocaleString()}</td>
                    <td className="border-b p-2 text-center">{solicitud.policia_asignado}</td>
                    <td className="border-b p-2 text-center">{solicitud.circuito.ciudad}</td>
                    <td className="border-b p-2 text-center">{solicitud.circuito.barrio}</td>
                    <td className="border-b p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleDeleteClick(solicitud)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <FiTrash />
                      </button>
                      <button
                        onClick={() => handleRowClick(solicitud)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-4">No existen solicitudes registradas</p>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>
              ¿Está seguro de que desea eliminar la solicitud con ID {solicitudToDelete?.id_solicitud}?
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Button = ({ text, number, icon, onClick }) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-between w-full"
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
    <span>{number}</span>
  </button>
);

export default ConsultaSolicitudes;
