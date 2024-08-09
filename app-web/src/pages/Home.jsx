import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import PropTypes from 'prop-types';
import { FiAlertCircle, FiCheckCircle, FiUserCheck, FiShield, FiSmile, FiFlag,FiEye } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as jwtDecode from 'jwt-decode';



const Button = ({ text, subText, number, onClick, icon }) => {
  return (
    <button
      className="w-full h-full bg-white text-gray-800 p-4 rounded-lg shadow-md flex flex-col items-start justify-between hover:bg-black hover:text-white transition duration-300"
      onClick={onClick}
    >
      <div className="text-left flex justify-between items-center w-full">
        <div>
          <span className="block text-lg font-bold">{text}</span>
          <span className="block text-sm">{subText}</span>
          {number !== null && <span className="block text-lg font-bold">{number}</span>}
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
};

Button.defaultProps = {
  subText: '',
  number: null,
};

const Home = () => {
  const [stats, setStats] = useState({});
  const [topSolicitudes, setTopSolicitudes] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/estadisticas/contadorSolicitudesTotales');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchTopSolicitudes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/solicitud/top10solicitudes');
        setTopSolicitudes(response.data);
      } catch (error) {
        console.error('Error fetching top solicitudes:', error);
      }
    };

    fetchStats();
    fetchTopSolicitudes();
  }, []);

  useEffect(() => {
    if (user) {

      console.log(`Bienvenido, ${user.email}.`);
    }
  }, [user]);



  // Datos y opciones del gráfico de pastel
  const pieChartData = [stats.byStatus?.counts?.['Solicitudes falsas'] || 0, stats.byStatus?.counts?.['Solicitudes en Progreso'] || 0];
  const pieChartOptions = {
    chart: {
      type: 'pie',
      width: '100%',
      height: '100%',
      toolbar: {
        show: true,
      },
    },
    labels: ['Solicitudes falsas', 'Solicitudes en Progreso'],
    colors: ['#ff073a', '#007bff'],
  };

  // Datos y opciones del gráfico de líneas
  const lineChartData = [
    {
      name: 'Politecnica',
      data: [30, 40, 35, 50],
    },
    {
      name: 'Ec911',
      data: [20, 35, 45, 30],
    },
    {
      name: 'Ficoa',
      data: [45, 50, 30, 40],
    },
  ];
  const lineChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    },
    yaxis: {
      categories: ['Politecnica', 'Ec911', 'Ficoa'],
    },
    legend: {
      position: 'top',
    },
  };

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
            subText={stats.total?.count || 0}
            icon={<FiUserCheck size={24} />}
            onClick={() => console.log('Botón Total Solicitudes presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Resueltas"
            number={stats.byStatus?.counts?.['Solicitudes resueltas'] || 0}
            icon={<FiCheckCircle size={24} />}
            onClick={() => console.log('Botón Solicitudes Resueltas presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Pendientes"
            number={stats.byStatus?.counts?.['Solicitudes pendientes'] || 0}
            icon={<FiSmile size={24} />}
            onClick={() => console.log('Botón Solicitudes Pendientes presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes en Progreso"
            number={stats.byStatus?.counts?.['Solicitudes en Progreso'] || 0}
            icon={<FiShield size={24} />}
            onClick={() => console.log('Botón Solicitudes en Progreso presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Solicitudes Falsas"
            number={stats.byStatus?.counts?.['Solicitudes falsas'] || 0}
            icon={<FiFlag size={24} />}
            onClick={() => console.log('Botón Solicitudes Falsas presionado')}
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
          <ApexCharts options={lineChartOptions} series={lineChartData} type="line" height={300} />
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
            <ApexCharts options={pieChartOptions} series={pieChartData} type="pie" />
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
                <th className="border-b p-2">Policía Asignado</th>
                <th className="border-b p-2">Ciudad</th>
                <th className="border-b p-2">Barrio</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {topSolicitudes.map((solicitud) => (
                <tr key={solicitud.id_solicitud}>
                  <td className="py-2 px-4">{solicitud.id_solicitud}</td>
                  <td className="py-2 px-4">{solicitud.estado}</td>
                  <td className="py-2 px-4">{solicitud.subtipo}</td>
                  <td className="py-2 px-4">{new Date(solicitud.fecha_creacion).toLocaleString()}</td>
                  <td className="border-b p-2 text-center">{solicitud.policia_asignado}</td>
                  <td className="border-b p-2 text-center">{solicitud.circuito.ciudad}</td>
                  <td className="border-b p-2 text-center">{solicitud.circuito.barrio}</td>
                  <td className="border-b p-2 flex gap-2 justify-center">
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
