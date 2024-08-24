import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import PropTypes from "prop-types";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiUserCheck,
  FiShield,
  FiSmile,
  FiFlag,
  FiEye,
} from "react-icons/fi";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import EstadoBadge from "./components/EstadoBadge"; // Importa el componente

// Función para determinar las clases de color en base al estado
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

const Button = ({ text, subText = "", number = null, onClick, icon, estado }) => {
  const badgeClass = getBadgeClass(estado);

  return (
    <button
      className={`w-full h-full ${badgeClass} p-4 rounded-lg shadow-md flex flex-col items-start justify-between transition duration-300`}
      onClick={onClick}
    >
      <div className="text-left flex justify-between items-center w-full">
        <div>
          <span className="block text-lg font-bold">{text}</span>
          <span className="block text-sm">{subText}</span>
          {number !== null && (
            <span className="block text-lg font-bold">{number}</span>
          )}
        </div>
        {icon}
      </div>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  subText: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  estado: PropTypes.string,
};


const Home = () => {
  const [stats, setStats] = useState({});
  const [topSolicitudes, setTopSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/estadisticas/contadorSolicitudesTotales"
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchTopSolicitudes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/solicitud/top10solicitudes"
        );
        setTopSolicitudes(response.data);
      } catch (error) {
        console.error("Error fetching top solicitudes:", error);
      }
    };

    fetchStats();
    fetchTopSolicitudes();
  }, []);

  // Datos y opciones del gráfico de pastel
  const pieChartData = [
    stats.byStatus?.counts?.["Solicitudes falsas"] || 0,
    stats.byStatus?.counts?.["Solicitudes en Progreso"] || 0,
  ];
  const pieChartOptions = {
    chart: {
      type: "pie",
      width: "100%",
      height: "100%",
      toolbar: {
        show: true,
      },
    },
    labels: ["Solicitudes falsas", "Solicitudes en Progreso"],
    colors: ["#ff073a", "#007bff"],
  };

  // Datos y opciones del gráfico de líneas
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
      {/* Botones con iconos */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Total Solicitudes"
            number={stats.total?.count || 0}
            icon={<FiUserCheck size={24} />}
            onClick={() => console.log("Botón Total Solicitudes presionado")}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Resueltas"
            estado="Resuelto"
            number={stats.byStatus?.counts?.["Solicitudes resueltas"] || 0}
            icon={<FiCheckCircle size={24} />}
            onClick={() =>
              console.log("Botón Solicitudes Resueltas presionado")
            }
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Pendientes"
            estado="Pendiente"
            number={stats.byStatus?.counts?.["Solicitudes pendientes"] || 0}
            icon={<FiSmile size={24} />}
            onClick={() =>
              console.log("Botón Solicitudes Pendientes presionado")
            }
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes en Progreso"
            estado="En progreso"
            number={stats.byStatus?.counts?.["Solicitudes en Progreso"] || 0}
            icon={<FiShield size={24} />}
            onClick={() =>
              console.log("Botón Solicitudes en Progreso presionado")
            }
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Falsas"
            estado="Falso"
            number={stats.byStatus?.counts?.["Solicitudes falsas"] || 0}
            icon={<FiFlag size={24} />}
            onClick={() => console.log("Botón Solicitudes Falsas presionado")}
          />
        </div>
      </div>

      {/* Contadores por tipo de solicitud */}
      <h2 className="text-lg font-bold mb-4">Registro por tipo de solicitud</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.porTipoSolicitud?.map((tipo) => (
          <div key={tipo.id_tipo} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="mr-3">
                <FiAlertCircle size={20} color="#007bff" />
              </div>
              <div>
                <p className="text-base font-bold">{tipo.tipo_descripcion}</p>
                <p className="text-sm">{tipo.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Desempeños</h2>
          <ApexCharts
            options={barOptions}
            series={barSeries}
            type="bar"
            height={350}
          />
        </div>

        <div className="col-span-1 bg-white p-1 rounded-lg shadow-md flex flex-col justify-center items-center">
          {/* Cuadros de información */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center">
                <div className="mr-3">
                  <FiAlertCircle size={20} color="#007bff" />
                </div>
                <div>
                  <p className="text-base font-bold">Robos</p>
                  <p className="text-sm">{pieChartData[0]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-md">
              <div className="flex items-center">
                <div className="mr-3">
                  <FiCheckCircle size={20} color="#28a745" />
                </div>
                <div>
                  <p className="text-base font-bold">Resueltos</p>
                  <p className="text-sm">{pieChartData[1]}</p>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-bold mb-14">Distribución de Casos</h2>
          <div className="w-full">
            <ApexCharts
              options={pieChartOptions}
              series={pieChartData}
              type="pie"
            />
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Actividad Reciente</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">ID Solicitud</th>
                <th className="py-2 px-4 text-left">Estado</th>
                <th className="py-2 px-4 text-left">Subtipo</th>
                <th className="py-2 px-4 text-left">Fecha</th>
                <th className="py-2 px-4 text-left">Distrito</th>
                <th className="py-2 px-4 text-left">Cantón</th>
                <th className="py-2 px-4 text-left">Subzona</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {topSolicitudes.map((solicitud) => (
                <tr key={solicitud.id_solicitud}>
                  <td className="py-2 px-4">{solicitud.id_solicitud}</td>
                  <td className="py-2 px-4">
                    <EstadoBadge estado={solicitud.estado} tipo="estado" />
                  </td>
                  <td className="py-2 px-4">{solicitud.subtipo}</td>
                  <td className="py-2 px-4">
                    {new Date(solicitud.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{solicitud.ubicacion?.distrito || 'Sin Distrito'}</td>
                  <td className="py-2 px-4">{solicitud.ubicacion?.canton || 'Sin Cantón'}</td>
                  <td className="py-2 px-4">{solicitud.ubicacion?.subzona || 'Sin Subzona'}</td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
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
      </div>
    </div>
  );
};

export default Home;

