import React, { useState, useEffect, useCallback  } from "react";
import { FiUserCheck, FiCheckCircle, FiSmile, FiEye, FiPower } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EstadoBadge from "./components/EstadoBadge"; 
import io from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;


const getBadgeClass = (estado) => {
  switch (estado) {
      case "Pendiente":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
      case "En progreso":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900";
      case "Resuelto":
          return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
      case "Falso":
          return "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900";
      default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900";
  }
};

const Button = ({ text, number, icon, estado }) => {
  const badgeClass = getBadgeClass(estado);

  return (
      <button className={`w-full h-full ${badgeClass} p-4 rounded-lg shadow-md flex flex-col items-start justify-between transition duration-300`}>
          <div className="text-left flex justify-between items-center w-full">
              <div>
                  <span className="block text-lg font-bold">{text}</span>
                  {number !== null && <span className="block text-lg font-bold">{number}</span>}
              </div>
              {icon}
          </div>
      </button>
  );
};

const socket = io(`${API_URL}`); // Conectar a Socket.IO

const Home4 = () => {
  const { user } = useSelector((state) => state.auth); // Obtén el usuario del estado de Redux

  const [policeStats, setPoliceStats] = useState({
    total: 0,
    disponibles: 0,
    ocupados: 0,
  });
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [policeData, setPoliceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Estado para el modal de asignación
  const [selectedPolice, setSelectedPolice] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const recordsPerPage = 4;

    // ✅ Función para obtener solicitudes pendientes desde la API
    const fetchSolicitudesPendientes = useCallback(async () => {
      try {
        const response = await axios.get(
          `${API_URL}/solicitud/solicitudesPendientes`
        );
        setSolicitudesPendientes(response.data);
      } catch (error) {
        console.error("Error fetching solicitudes pendientes:", error);
      }
    }, []);

  useEffect(() => {
    // Fetch police stats
    axios
      .get(`${API_URL}/estadisticas/contadorePolicias`)
      .then((response) => setPoliceStats(response.data))
      .catch((error) => console.error("Error fetching police stats:", error));

    // // Fetch solicitudes pendientes
    // const fetchSolicitudesPendientes = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:3000/solicitud/solicitudesPendientes");
    //     setSolicitudesPendientes(response.data);
    //   } catch (error) {
    //     console.error("Error fetching solicitudes pendientes:", error);
    //   }
    // };

    // Fetch police data (mock or actual API call)
    axios
      .get(`${API_URL}/personas/policiasDisponibles`)
      .then((response) => setPoliceData(response.data.policias))
      .catch((error) => console.error("Error fetching police data:", error));

      fetchSolicitudesPendientes();

       // Escuchar eventos de Socket.IO
    socket.on("nuevaSolicitud", (nuevaSolicitud) => {
      setSolicitudesPendientes((prev) => [nuevaSolicitud, ...prev]);
    });
    socket.on("actualizarSolicitud", (data) => {
      actualizarSolicitudPendiente(data);
    });

    socket.on("solicitudCerrada", (data) => {
      eliminarSolicitudPendiente(data.id_solicitud);
    });

    return () => {
      socket.off("nuevaSolicitud");
    };

  }, [fetchSolicitudesPendientes]);

   // Función para actualizar el estado de una solicitud pendiente
   const actualizarSolicitudPendiente = (data) => {
    setSolicitudesPendientes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.id_solicitud === data.id_solicitud
          ? { ...solicitud, estado: data.estado }
          : solicitud
      )
    );
  };

  // Función para eliminar una solicitud pendiente cuando se resuelve o se cierra
  const eliminarSolicitudPendiente = (id_solicitud) => {
    setSolicitudesPendientes((prevSolicitudes) =>
      prevSolicitudes.filter((solicitud) => solicitud.id_solicitud !== id_solicitud)
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAssignClick = (solicitud) => {
    setSelectedReport(solicitud);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (selectedPolice && selectedReport && user) {
      try {
        // Enviar solicitud POST para asignar el policía
        await axios.post(`${API_URL}/solicitud/asignarPolicia`, {
          id_solicitud: selectedReport.id_solicitud,
          id_persona_asignador: user.id_persona,
          id_persona_policia: selectedPolice.id_persona,
        });

        // Actualizar el estado del policía y eliminar el policía ocupado de la lista
        setPoliceData((prevData) => {
          // Actualizar la disponibilidad del policía seleccionado
          const updatedPoliceData = prevData.map((police) =>
            police.id_persona === selectedPolice.id_persona
              ? { ...police, disponibilidad: "Ocupado" }
              : police
          );

          // Filtrar los policías ocupados de la lista
          return updatedPoliceData.filter(
            (police) => police.disponibilidad !== "Ocupado"
          );
        });

        // Eliminar la solicitud asignada de la lista de solicitudes pendientes
        setSolicitudesPendientes((prevRequests) =>
          prevRequests.filter(
            (request) => request.id_solicitud !== selectedReport.id_solicitud
          )
        );

        setNotification("Policía asignado satisfactoriamente");

        setTimeout(() => {
          setNotification("");
        }, 3000); // Hide notification after 3 seconds

        setIsAssignModalOpen(false);
        setSelectedPolice(null);
        setSelectedReport(null);
      } catch (error) {
        console.error("Error al asignar el policía:", error);
        setNotification("Error al asignar el policía. Inténtalo nuevamente.");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    }
  };

  const handleCancelAssign = () => {
    setIsAssignModalOpen(false);
    setSelectedPolice(null);
    setSelectedReport(null);
  };

  const handleSelectPolice = (police) => {
    setSelectedPolice(police);
  };


  const handleRowClick = (solicitud) => {
    navigate(`/solicitudes/${solicitud.id_solicitud}`);
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          {/* <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-100 rounded-lg">
              <Button
                text="Policias registrados"
                number={policeStats.total}
                icon={<FiCheckCircle size={28} />}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-100 rounded-lg">
              <Button
                text="Policias disponibles"
                number={policeStats.disponibles}
                icon={<FiCheckCircle size={28} />}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-100 rounded-lg">
              <Button
                text="Policias ocupados"
                number={policeStats.ocupados}
                icon={<FiCheckCircle size={28} />}
              />
            </div>
          </div> */}

          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Asignar Policias</h2>
    
          </div>
        </div>

      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-5">
                    <Button text="Policias registrados" number={policeStats.total|| 0} icon={<FiUserCheck size={24} />} estado="Pendiente" />
                </div>
                <div className="p-5">
                    <Button text="Policias disponibles" number={policeStats.disponibles || 0} icon={<FiCheckCircle size={24} />} estado="Resuelto" />
                </div>
                <div className="p-5">
                    <Button text="Policias ocupados" number={policeStats.ocupados || 0} icon={<FiEye size={24} />} estado="Falso" />
                </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Solicitudes Pendientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b p-2">ID Solicitud</th>
                <th className="border-b p-2">Estado</th>
                <th className="border-b p-2">Tipo</th>
                <th className="border-b p-2">Subtipo</th>
                <th className="border-b p-2">Creado por</th>
                <th className="border-b p-2">Distrito</th>
                <th className="border-b p-2">Cantón</th>
                <th className="border-b p-2">Subzona</th>
                <th className="border-b p-2">Fecha Creación</th>
                <th className="border-b p-2">Asignar</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesPendientes.length > 0 ? (
                solicitudesPendientes.map((solicitud) => (
                  <tr key={solicitud.id_solicitud} className="text-center">
                    <td className="border-b p-2">{solicitud.id_solicitud}</td>
                    <td className="border-b p-2">
                      <EstadoBadge estado={solicitud.estado} tipo="estado" />
                    </td>
                    <td className="border-b p-2">{solicitud.tipo}</td>
                    <td className="border-b p-2">{solicitud.subtipo}</td>
                    <td className="border-b p-2">{solicitud.creado_por}</td>
                    <td className="border-b p-2">
                      {solicitud.ubicacion.distrito}
                    </td>
                    <td className="border-b p-2">
                      {solicitud.ubicacion.canton}
                    </td>
                    <td className="border-b p-2">
                      {solicitud.ubicacion.subzona}
                    </td>
                    <td className="border-b p-2">
                      {new Date(solicitud.fecha_creacion).toLocaleString()}
                    </td>
                    <td className="border-b p-2 flex gap-2 justify-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleAssignClick(solicitud)}
                      >
                        Asignar Policía
                      </button>
                      <button
                        onClick={() => handleRowClick(solicitud)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    No hay solicitudes pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(policeData.length / recordsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg max-w-5xl w-full">
            <h2 className="text-lg font-bold mb-4">Seleccionar Policía</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b p-2">ID Policía</th>
                    <th className="border-b p-2">Nombres</th>
                    <th className="border-b p-2">Apellidos</th>
                    <th className="border-b p-2">Teléfono</th>
                    <th className="border-b p-2">Distrito</th>
                    <th className="border-b p-2">Cantón</th>
                    <th className="border-b p-2">Subzona</th>
                    <th className="border-b p-2">Disponibilidad</th>
                    <th className="border-b p-2">Asignar</th>
                  </tr>
                </thead>
                <tbody>
                  {policeData.length > 0 ? (
                    policeData.map((police) => (
                      <tr key={police.id_persona} className="text-center">
                        <td className="border-b p-2">{police.id_persona}</td>
                        <td className="border-b p-2">{police.nombres}</td>
                        <td className="border-b p-2">{police.apellidos}</td>
                        <td className="border-b p-2">{police.telefono}</td>
                        <td className="border-b p-2">
                          {police.nombre_distrito}
                        </td>
                        <td className="border-b p-2">
                          {police.nombre_canton}
                        </td>
                        <td className="border-b p-2">
                          {police.nombre_subzona}
                        </td>
                        <td className="border-b p-2">
                          <EstadoBadge
                            estado={police.disponibilidad}
                            tipo="disponibilidad"
                          />
                        </td>
                        <td className="border-b p-2">
                          <button
                            className={`px-3 py-1 rounded ${
                              selectedPolice?.id_persona === police.id_persona
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                            }`}
                            onClick={() => handleSelectPolice(police)}
                          >
                            {selectedPolice?.id_persona === police.id_persona
                              ? "Seleccionado"
                              : "Seleccionar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center p-4 text-gray-500">
                        No hay policías disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={handleConfirmAssign}
              >
                Confirmar Asignación
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleCancelAssign}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed top-12 right-10 bg-green-500 text-white px-5 py-3 rounded">
          {notification}
        </div>
      )}
    </div>
  );
};



export default Home4;
