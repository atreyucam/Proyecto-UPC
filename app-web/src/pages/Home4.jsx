import React from 'react';
import { FiUserCheck, FiCheckCircle, FiSmile } from 'react-icons/fi';
import ApexCharts from 'react-apexcharts';

const Home4 = () => {

  // Datos y opciones combinadas para el gráfico de columnas, áreas y líneas
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

      

        {/* Gráfico de columnas, áreas y líneas */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Fuentes de Tráfico</h2>
          <ApexCharts options={combinedOptions} series={combinedSeries} type="line" height={350} />
        </div>
      </div>
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
