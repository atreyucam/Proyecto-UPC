import React, { useState } from 'react';
import { FiUserCheck, FiCheckCircle, FiSmile } from 'react-icons/fi';
import ApexCharts from 'react-apexcharts';

const Home4 = () => {
  const combinedSeries = [
    {
      name: 'Policias no activos',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
    },
    {
      name: 'Policias activos',
      type: 'area',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
    },
    {
      name: 'No asignados',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
    },
  ];

  const combinedOptions = {
    series: combinedSeries,
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    stroke: {
      width: [0, 2, 5],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      '01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003',
      '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003',
      '11/01/2003'
    ],
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Datos',
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' points';
          }
          return y;
        },
      },
    },
  };

  const initialPoliceData = [
    { id: 1, firstName: 'John', lastName: 'Doe', rank: 'Sargento', circuit: 'Circuito 1', status: 'Activo' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', rank: 'Oficial', circuit: 'Circuito 2', status: 'No activo' },
    { id: 3, firstName: 'Michael', lastName: 'Johnson', rank: 'Capitán', circuit: 'Circuito 3', status: 'Activo' },
    { id: 4, firstName: 'Emily', lastName: 'Davis', rank: 'Sargento', circuit: 'Circuito 4', status: 'No activo' },
    { id: 5, firstName: 'Daniel', lastName: 'Wilson', rank: 'Oficial', circuit: 'Circuito 5', status: 'Activo' },
    { id: 6, firstName: 'Sarah', lastName: 'Brown', rank: 'Sargento', circuit: 'Circuito 6', status: 'No activo' },
    { id: 7, firstName: 'Emma', lastName: 'Lee', rank: 'Oficial', circuit: 'Circuito 7', status: 'Activo' },
    { id: 8, firstName: 'James', lastName: 'Miller', rank: 'Sargento', circuit: 'Circuito 8', status: 'No activo' },
    { id: 9, firstName: 'Olivia', lastName: 'White', rank: 'Capitán', circuit: 'Circuito 9', status: 'Activo' },
    { id: 10, firstName: 'Noah', lastName: 'Davis', rank: 'Oficial', circuit: 'Circuito 10', status: 'No activo' },
  ];

  const [policeData, setPoliceData] = useState(initialPoliceData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolice, setSelectedPolice] = useState(null);
  const recordsPerPage = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAssignClick = (police) => {
    setSelectedPolice(police);
    setIsModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedPolice) {
      setPoliceData(prevData =>
        prevData.map(police =>
          police.id === selectedPolice.id ? { ...police, status: 'En Progreso' } : police
        )
      );
    }
    setIsModalOpen(false);
    setSelectedPolice(null);
  };

  const handleCancelAssign = () => {
    setIsModalOpen(false);
    setSelectedPolice(null);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = policeData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="container mx-auto px-3 py-8">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-lg">
            <Button
              text="Policias disponibles"
              number={100}
              icon={<FiUserCheck size={24} />}
              onClick={() => console.log('Botón Disponible presionado')}
            />
          </div>
          <div className="bg-gray-100 rounded-lg">
            <Button
              text="Total Resueltos"
              number={100}
              icon={<FiCheckCircle size={24} />}
              onClick={() => console.log('Botón Estado presionado')}
            />
          </div>
          <div className="bg-gray-100 rounded-lg">
            <Button
              text="Disponibles"
              number={50}
              icon={<FiSmile size={24} />}
              onClick={() => console.log('Botón Amistad presionado')}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Fuentes de Tráfico</h2>
          <ApexCharts options={combinedOptions} series={combinedSeries} type="line" height={350} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Policías Recientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Apellido</th>
                <th className="border-b p-2">Rango</th>
                <th className="border-b p-2">Circuito</th>
                <th className="border-b p-2">Estado</th>
                <th className="border-b p-2">Asignación</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(police => (
                <tr key={police.id} className="text-center">
                  <td className="border-b p-2">{police.firstName}</td>
                  <td className="border-b p-2">{police.lastName}</td>
                  <td className="border-b p-2">{police.rank}</td>
                  <td className="border-b p-2">{police.circuit}</td>
                  <td className="border-b p-2">{police.status}</td>
                  <td className="border-b p-2">
                    <button
                      className={`px-4 py-2 rounded ${police.status === 'Activo' ? 'bg-blue-500 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
                      onClick={() => police.status === 'Activo' && handleAssignClick(police)}
                      disabled={police.status !== 'Activo'}
                    >
                      Asignar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-4">

        {Array.from({ length: Math.ceil(policeData.length / recordsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Confirmar Asignación</h2>
            <p>¿Desea asignar al oficial {selectedPolice.firstName} {selectedPolice.lastName}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCancelAssign}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmAssign}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Button = ({ text, subText, number, onClick, icon }) => {
  return (
    <button
      className="flex items-center justify-between bg-white text-gray-800 p-4 rounded-lg shadow-md hover:bg-black hover:text-white transition duration-300 w-full"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div>{icon}</div>
        <div>
          <span className="block text-lg font-bold">{text}</span>
          {subText && <span className="block text-sm">{subText}</span>}
          {number !== null && <span className="block text-lg font-bold">{number}</span>}
        </div>
      </div>
    </button>
  );
};

export default Home4;
