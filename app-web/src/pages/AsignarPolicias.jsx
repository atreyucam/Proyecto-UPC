import React, { useState, useEffect } from "react";
import { FiUserCheck, FiCheckCircle, FiSmile, FiEye } from "react-icons/fi";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home4 = () => {
  const { user } = useSelector((state) => state.auth); // Obtén el usuario del estado de Redux

  const [policeStats, setPoliceStats] = useState({
    total: 0,
    disponibles: 0,
    ocupados: 0,
  });
  const [solicitudesTotales, setSolicitudesTotales] = useState({});
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [policeData, setPoliceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Estado para el modal de asignación
  const [selectedPolice, setSelectedPolice] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState("");
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const recordsPerPage = 4;

  useEffect(() => {
    // Fetch police stats
    axios
      .get("http://localhost:3000/estadisticas/contadorePolicias")
      .then((response) => setPoliceStats(response.data))
      .catch((error) => console.error("Error fetching police stats:", error));

    // Fetch solicitudes totales
    axios
      .get("http://localhost:3000/estadisticas/contadorSolicitudesTotales")
      .then((response) => setSolicitudesTotales(response.data))
      .catch((error) =>
        console.error("Error fetching solicitudes totales:", error)
      );

    // Fetch solicitudes pendientes
    axios
      .get("http://localhost:3000/solicitud/solicitudesPendientes")
      .then((response) => setSolicitudesPendientes(response.data))
      .catch((error) =>
        console.error("Error fetching solicitudes pendientes:", error)
      );

    // Fetch police data (mock or actual API call)
    axios
      .get("http://localhost:3000/personas/policiasDisponibles")
      .then((response) => setPoliceData(response.data.policias))
      .catch((error) => console.error("Error fetching police data:", error));

    // Fetch reports
    axios
      .get("http://localhost:3000/reports")
      .then((response) => setReports(response.data))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

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
        await axios.post("http://localhost:3000/solicitud/asignarPolicia", {
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

          // Filtrar los policías ocupados de la lista (suponiendo que no quieres mostrar policías ocupados)
          return updatedPoliceData.filter(
            (police) => police.disponibilidad !== "Ocupado"
          );
        });

        // Eliminar la solicitud asignada de la lista
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

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = policeData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Define chart options and series data
  const [barOptions, setBarOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"],
    },
    yaxis: {
      title: {
        text: "Solicitudes",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " solicitudes";
        },
      },
    },
  });

  const [barSeries, setBarSeries] = useState([
    {
      name: "Botón Emergencia",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Denuncia Ciudadana",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Servicios Comunitarios",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ]);

  const handleRowClick = (solicitud) => {
    navigate(`/solicitudes/${solicitud.id_solicitud}`);
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-5">
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
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">
              Total Solicitudes por Tipo
            </h2>
            <ul>
              {solicitudesTotales.byType?.map((tipo) => (
                <li key={tipo.id_tipo}>
                  Tipo {tipo.id_tipo}: {tipo.count}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Disponibilidad</h2>
          <ApexCharts
           options={barOptions}
           series={barSeries}
           type="bar"
           height={350}
          />
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
                <th className="border-b p-2">Circuito</th>
                <th className="border-b p-2">Fecha Creación</th>
                <th className="border-b p-2">Asignar</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesPendientes.length > 0 ? (
                solicitudesPendientes.map((solicitud) => (
                  <tr key={solicitud.id_solicitud} className="text-center">
                    <td className="border-b p-2">{solicitud.id_solicitud}</td>
                    <td className="border-b p-2">{solicitud.estado}</td>
                    <td className="border-b p-2">{solicitud.tipo}</td>
                    <td className="border-b p-2">{solicitud.subtipo}</td>
                    <td className="border-b p-2">{solicitud.creado_por}</td>
                    <td className="border-b p-2">
                      {solicitud.circuito.ciudad}
                    </td>
                    <td className="border-b p-2">
                      {new Date(solicitud.fecha_creacion).toLocaleString()}
                    </td>
                    <td className="border-b p-2 flex gap-2 justify-center">
                      <button
                        className=" bg-green-500 text-white px-3 py-1 rounded"
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
                  <td colSpan="8" className="text-center p-4 text-gray-500">
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
                    <th className="border-b p-2">Telefono</th>
                    <th className="border-b p-2">Barrio</th>
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
                          {police.Circuito.barrio}
                        </td>
                        <td className="border-b p-2">
                          {police.disponibilidad}
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
                      <td colSpan="7" className="text-center p-4 text-gray-500">
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

const Button = ({ text, number, icon }) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-between w-full"
    // onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
    <span>{number}</span>
  </button>
);

export default Home4;
