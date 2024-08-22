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
    { numero: 3, tipo: 'Hurto', fechaGenerada: '2024-08-03', incremento: '15%', absoluta: 200, pesoDelictual: 0.9 },
    // Add more data entries here
  ];

  const additionalTableData = [
    { numero: 1, circuito: 'Circuito A', enero2023: 50, enero2024: 100, incremento: '100%', absoluta: 50, pesoDelictual: 0.8 },
    { numero: 2, circuito: 'Circuito B', enero2023: 150, enero2024: 120, incremento: '-20%', absoluta: -30, pesoDelictual: 0.6 },
    { numero: 3, circuito: 'Circuito C', enero2023: 70, enero2024: 80, incremento: '14%', absoluta: 10, pesoDelictual: 0.7 },
    // Add more data entries here
  ];

  // Calculate totals for Denuncia Table
  const totalDenuncias = {
    incremento: denunciaData.reduce((total, denuncia) => total + parseFloat(denuncia.incremento), 0),
    absoluta: denunciaData.reduce((total, denuncia) => total + denuncia.absoluta, 0),
    pesoDelictual: denunciaData.reduce((total, denuncia) => total + denuncia.pesoDelictual, 0)
  };

  // Calculate totals for Additional Table
  const totalAdditional = {
    incremento: additionalTableData.reduce((total, data) => total + parseFloat(data.incremento), 0),
    absoluta: additionalTableData.reduce((total, data) => total + data.absoluta, 0),
    pesoDelictual: additionalTableData.reduce((total, data) => total + data.pesoDelictual, 0)
  };

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

    // Add total row to Denuncia Table
    denunciaTable.push([
      'Total',
      '',
      '',
      '',
      totalDenuncias.absoluta,
      totalDenuncias.pesoDelictual.toFixed(2)
    ]);

    autoTable(doc, {
      head: [['Numero', 'Tipo de Denuncia', 'Fecha Generada', 'Incremento', 'Absoluta', 'Peso Delictual']],
      body: denunciaTable,
      startY: doc.previousAutoTable.finalY + 10,
    });

    // Additional Table
    const additionalTable = additionalTableData.map(data => [
      data.numero,
      data.circuito,
      data.enero2023,
      data.enero2024,
      { content: `${data.incremento}`, styles: { fillColor: data.incremento.includes('%') ? [255, 0, 0] : undefined }},
      { content: `${data.absoluta}`, styles: { textColor: data.absoluta > 0 ? [0, 128, 0] : [255, 0, 0] }},
      data.pesoDelictual
    ]);

    // Add total row to Additional Table
    additionalTable.push([
      'Total',
      '',
      '',
      '',
      totalAdditional.incremento.toFixed(2) + '%',
      totalAdditional.absoluta,
      totalAdditional.pesoDelictual.toFixed(2)
    ]);

    autoTable(doc, {
      head: [['Numero', 'Circuito', '01 Enero 2023', '01 Enero 2024', 'Incremento', 'Absoluta', 'Peso Delictual']],
      body: additionalTable,
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
            {denunciaData.map((denuncia) => (
              <tr key={denuncia.numero}>
                <td className="border px-4 py-2">{denuncia.numero}</td>
                <td className="border px-4 py-2">{denuncia.tipo}</td>
                <td className="border px-4 py-2">{denuncia.fechaGenerada}</td>
                <td className="border px-4 py-2">{denuncia.incremento}</td>
                <td className="border px-4 py-2">{denuncia.absoluta}</td>
                <td className="border px-4 py-2">{denuncia.pesoDelictual}</td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2 font-bold">Total</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2 font-bold">{totalDenuncias.absoluta}</td>
              <td className="border px-4 py-2 font-bold">{totalDenuncias.pesoDelictual.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Tabla Adicional</h2>
        <table id="additional-table" className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Numero</th>
              <th className="border px-4 py-2">Circuito</th>
              <th className="border px-4 py-2">01 Enero 2023</th>
              <th className="border px-4 py-2">01 Enero 2024</th>
              <th className="border px-4 py-2">Incremento</th>
              <th className="border px-4 py-2">Absoluta</th>
              <th className="border px-4 py-2">Peso Delictual</th>
            </tr>
          </thead>
          <tbody>
            {additionalTableData.map((data) => (
              <tr key={data.numero}>
                <td className="border px-4 py-2">{data.numero}</td>
                <td className="border px-4 py-2">{data.circuito}</td>
                <td className="border px-4 py-2">{data.enero2023}</td>
                <td className="border px-4 py-2">{data.enero2024}</td>
                <td className="border px-4 py-2">{data.incremento}</td>
                <td className="border px-4 py-2">{data.absoluta}</td>
                <td className="border px-4 py-2">{data.pesoDelictual}</td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2 font-bold">Total</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2 font-bold">{totalAdditional.incremento.toFixed(2)}%</td>
              <td className="border px-4 py-2 font-bold">{totalAdditional.absoluta}</td>
              <td className="border px-4 py-2 font-bold">{totalAdditional.pesoDelictual.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={downloadPDF}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Descagar PDF
      </button>
    </div>
  );
};

export default ConsultaSolicitudes;
