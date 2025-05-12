import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const ResumenGeneral = () => {
  const [data, setData] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("2025-03-01");
  const [fechaFin, setFechaFin] = useState("2025-03-16");
  const refToExport = useRef();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/reportes/general`, {
        params: { fechaInicio, fechaFin },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportarPDF = async () => {
    const element = refToExport.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("reporte_resumen.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Resumen General</h2>

      {/* 🎯 Filtros de fecha */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="font-medium">Desde:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </div>
        <div>
          <label className="font-medium">Hasta:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </div>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Aplicar filtro
        </button>
        <button
          onClick={exportarPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Exportar PDF
        </button>
      </div>

      {/* 📋 Contenido exportable */}
      <div ref={refToExport}>
        {data ? (
          <>
            {/* 🟩 Tarjetas de estado */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { label: "Total", valor: data.resumen.total },
                { label: "Pendientes", valor: data.resumen.pendientes },
                { label: "En Progreso", valor: data.resumen.en_progreso },
                { label: "Resueltos", valor: data.resumen.resueltos },
                { label: "Cancelados", valor: data.resumen.cancelados }
              ].map((item) => (
                <div key={item.label} className="min-w-[140px] bg-blue-100 text-blue-800 p-4 rounded-xl shadow">
                  <h3 className="font-bold">{item.label}</h3>
                  <p className="text-lg">{item.valor}</p>
                </div>
              ))}
            </div>

            {/* 🟦 Tarjetas de tipo */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Tipos de Solicitud</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.tipos.map((tipo) => (
                <div key={tipo.tipo} className="min-w-[160px] bg-green-100 text-green-800 p-4 rounded-xl shadow">
                  <h4 className="font-bold">{tipo.tipo}</h4>
                  <p className="text-lg">{tipo.total}</p>
                </div>
              ))}
            </div>

            {/* 🟪 Gráfico de barras horizontales */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Subtipos más Frecuentes</h3>
            <div className="w-full h-[500px] bg-white shadow p-4 rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={data.subtipos}
                  margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="subtipo" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8">
                    <LabelList dataKey="total" position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
    </div>
  );
};

export default ResumenGeneral;
