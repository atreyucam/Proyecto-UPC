import React, { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import PropTypes from 'prop-types';
import { FiAlertCircle, FiCheckCircle, FiUserCheck, FiShield, FiSmile, FiFlag } from 'react-icons/fi';
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
  // Datos y opciones del gráfico de pastel
  const pieChartData = [150, 30];
  const pieChartOptions = {
    chart: {
      type: 'pie',
      width: '100%', // Ajustar el ancho del gráfico de pastel al 100%
      height: '100%', // Ajustar el alto del gráfico de pastel al 100%
      toolbar: {
        show: true, // Ocultar la barra de herramientas del gráfico
      },
    },
    labels: ['Robo', 'Estado Resuelto'],
    colors: ['#007bff', '#28a745'],
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

  // Datos para la tabla de policías
  const initialPoliceData = [
    { id: 1, name: 'John Doe', createdAt: '2024-06-15', rank: 'Sargento', address: '123 Main St', status: 'En Progreso' },
    { id: 2, name: 'Jane Smith', createdAt: '2024-06-14', rank: 'Oficial', address: '456 Elm St', status: 'Por Asignar' },
    { id: 3, name: 'Michael Johnson', createdAt: '2024-06-13', rank: 'Capitán', address: '789 Oak St', status: 'Resuelto' },
    { id: 4, name: 'Emily Davis', createdAt: '2024-06-12', rank: 'Sargento', address: '246 Pine St', status: 'En Progreso' },
    { id: 5, name: 'Daniel Wilson', createdAt: '2024-06-11', rank: 'Oficial', address: '135 Cedar St', status: 'Por Asignar' },
    { id: 6, name: 'Sarah Brown', createdAt: '2024-06-10', rank: 'Sargento', address: '579 Maple St', status: 'En Progreso' },
    { id: 7, name: 'Emma Lee', createdAt: '2024-06-09', rank: 'Oficial', address: '789 Elm St', status: 'Resuelto' },
    { id: 8, name: 'James Miller', createdAt: '2024-06-08', rank: 'Sargento', address: '246 Oak St', status: 'Por Asignar' },
    { id: 9, name: 'Olivia White', createdAt: '2024-06-07', rank: 'Capitán', address: '135 Pine St', status: 'En Progreso' },
    { id: 10, name: 'Noah Davis', createdAt: '2024-06-06', rank: 'Oficial', address: '579 Cedar St', status: 'Resuelto' },
  ];

  // Estado para los datos de los policías y el estado de paginación
  const [policeData, setPoliceData] = useState(initialPoliceData);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Función para cambiar el estado de un policía
  const handleStatusChange = (id, status) => {
    const updatedPoliceData = policeData.map(police => {
      if (police.id === id) {
        return { ...police, status: status };
      }
      return police;
    });
    setPoliceData(updatedPoliceData);
  };

  // Calcular índices para los registros a mostrar en la página actual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = policeData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    
    <div className="container mx-auto px-3 py-8">
      {/* Botones con iconos */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Disponible"
            subText="Online"
            icon={<FiUserCheck size={24} />}
            onClick={() => console.log('Botón Disponible presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Total Resueltos"
            subText="Resuelto"
            number={100}
            icon={<FiCheckCircle size={24} />}
            onClick={() => console.log('Botón Estado presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Policías en línea"
            number={50}
            icon={<FiSmile size={24} />}
            onClick={() => console.log('Botón Amistad presionado')}
          />
        </div>
        <div className="p-5 bg-gray-100 rounded-lg">
          <Button
            text="Seguridad"
            number={200}
            icon={<FiShield size={24} />}
            onClick={() => console.log('Botón Seguridad presionado')}
          />
        </div>
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
              <p className="text-sm">150</p>
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
              <p className="text-sm">30</p>
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

      {/* Tabla de policías recientes */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Policías Recientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Fecha de Creación</th>
                <th className="border-b p-2">Rango</th>
                <th className="border-b p-2">Dirección</th>
                <th className="border-b p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(police => (
                <tr key={police.id} className="text-center">
                  <td className="border-b p-2">{police.name}</td>
                  <td className="border-b p-2">{police.createdAt}</td>
                  <td className="border-b p-2">{police.rank}</td>
                  <td className="border-b p-2">{police.address}</td>
                  <td className="border-b p-2">
                    <select
                      className="p-1 rounded bg-gray-200"
                      value={police.status}
                      onChange={(e) => handleStatusChange(police.id, e.target.value)}
                    >
                      <option value="En Progreso">En Progreso</option>
                      <option value="Por Asignar">Por Asignar</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="flex justify-end mt-4">
            <nav className="block">
              <ul className="flex pl-0 list-none rounded my-2">
                {[...Array(Math.ceil(policeData.length / recordsPerPage)).keys()].map(page => (
                  <li key={page} className="relative block px-3 py-2 leading-tight bg-white border border-gray-200 text-blue-700 mr-2 cursor-pointer">
                    <span onClick={() => handlePageChange(page + 1)}>{page + 1}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
