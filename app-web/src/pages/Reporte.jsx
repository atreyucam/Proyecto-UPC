import React, { useRef } from 'react';
import Chart from 'react-apexcharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from "react-router-dom";

const ConsultaSolicitudes = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const circuitData = {
    zona: "2",
    subzona: "Chimborazo",
    distrito: "Riobamba",
    totalParroquias: 20,
    circuitos: 32,
    subcircuitos: 32
  };

  const frequencyData = {
    categories: ['January', 'February', 'March', 'April'],
    series: [
      {
        name: 'Frecuencia',
        data: [30, 40, 35, 50]
      }
    ]
  };

  const denunciaData = [
    { numero: 1, tipo: 'Robo', fechaGenerada: '2024-08-01', incremento: '5%', absoluta: 100, pesoDelictual: 0.5 },
    { numero: 2, tipo: 'Asalto', fechaGenerada: '2024-08-02', incremento: '10%', absoluta: 150, pesoDelictual: 0.7 },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text('Reporte de Solicitudes', 20, 20);

    // Circuito Table
    autoTable(doc, {
      head: [['Zona', 'Subzona', 'Distrito', '', '', '']],
      body: [
        [circuitData.zona, circuitData.subzona, circuitData.distrito, '', '', ''],
        [{ content: `Total Parroquias: ${circuitData.totalParroquias}, Circuitos: ${circuitData.circuitos}, Subcircuitos: ${circuitData.subcircuitos}`, colSpan: 6, styles: { halign: 'center', fontSize: 16, fontStyle: 'bold' }}]
      ],
      startY: 30,
    });

    // Frequency Table
    autoTable(doc, {
      head: [['Mes', 'Frecuencia']],
      body: frequencyData.categories.map((month, index) => [
        month, frequencyData.series[0].data[index]
      ]),
      startY: doc.previousAutoTable.finalY + 10,
    });

    // Denuncia Table with red bars for incremento
    const denunciaTable = denunciaData.map(denuncia => [
      denuncia.numero,
      denuncia.tipo,
      denuncia.fechaGenerada,
      { content: `${denuncia.incremento}`, styles: { fillColor: denuncia.incremento.includes('%') ? [255, 0, 0] : undefined }},
      denuncia.absoluta,
      denuncia.pesoDelictual
    ]);

    autoTable(doc, {
      head: [['Numero', 'Tipo de Denuncia', 'Fecha Generada', 'Incremento', 'Absoluta', 'Peso Delictual']],
      body: denunciaTable,
      startY: doc.previousAutoTable.finalY + 10,
    });

    // Save PDF
    doc.save('reporte.pdf');
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-6">Reporte de solicitudes</h1>

      <div className="mb-6">
        <table id="circuito-table" className="table-auto w-full border-collapse">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-bold">Zona:</td>
              <td className="border px-4 py-2">{circuitData.zona}</td>
              <td className="border px-4 py-2 font-bold">Subzona:</td>
              <td className="border px-4 py-2">{circuitData.subzona}</td>
              <td className="border px-4 py-2 font-bold">Distrito:</td>
              <td className="border px-4 py-2">{circuitData.distrito}</td>
            </tr>
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center text-lg font-bold">
                Total Parroquias: {circuitData.totalParroquias}, Circuitos: {circuitData.circuitos}, Subcircuitos: {circuitData.subcircuitos}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Frecuencia Mensual</h2>
        <Chart
          ref={chartRef}
          options={{
            chart: { id: 'basic-bar' },
            xaxis: { categories: frequencyData.categories }
          }}
          series={frequencyData.series}
          type="bar"
          height="350"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Detalle de Denuncias</h2>
        <table id="denuncia-table" className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Numero</th>
              <th className="border px-4 py-2">Tipo de Denuncia</th>
              <th className="border px-4 py-2">Fecha Generada</th>
              <th className="border px-4 py-2">Incremento</th>
              <th className="border px-4 py-2">Absoluta</th>
              <th className="border px-4 py-2">Peso Delictual</th>
            </tr>
          </thead>
          <tbody>
            {denunciaData.map((denuncia, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{denuncia.numero}</td>
                <td className="border px-4 py-2">{denuncia.tipo}</td>
                <td className="border px-4 py-2">{denuncia.fechaGenerada}</td>
                <td className="border px-4 py-2">
                  <div className="flex items-center">
                    <div className="w-full bg-red-200">
                      <div
                        className="bg-red-500 text-xs leading-none py-1 text-center text-white"
                        style={{ width: denuncia.incremento }}
                      >
                        {denuncia.incremento}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border px-4 py-2">{denuncia.absoluta}</td>
                <td className="border px-4 py-2">{denuncia.pesoDelictual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded"
      >
        Descargar PDF
      </button>
    </div>
  );
};

export default ConsultaSolicitudes;
