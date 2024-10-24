import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const ConsultaReportes = () => {
    const chartRef = useRef(null);

    const [reportes, setReportes] = useState([]);
    const [filteredReportes, setFilteredReportes] = useState([]);
    const [filtros, setFiltros] = useState({
        anio: "",
        mes: "",
        tipo: "",
        subtipo: "",
    });

    const [tipos, setTipos] = useState([]);
    const [subtipos, setSubtipos] = useState([]);
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [tipoChartData, setTipoChartData] = useState({
        categories: [],
        series: [],
    });

    // Cargar el resumen de solicitudes
    useEffect(() => {
        const fetchResumen = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/solicitudes/resumen",
                    {
                        params: {
                            anio: filtros.anio || new Date().getFullYear(),
                        },
                    }
                );

                generateChartData(response.data.solicitudesPorMes);
                generateTipoChartData(response.data.solicitudesPorTipo);
            } catch (error) {
                console.error("Error al cargar el resumen:", error);
            }
        };

        fetchResumen();
    }, [filtros.anio]);

    // Generar los datos para el gráfico por mes
    const generateChartData = (data) => {
        const categories = data.map((item) => `Mes ${item.mes}`);
        const series = [
            { name: "Solicitudes", data: data.map((item) => item.cantidad) },
        ];

        setChartData({ categories, series });
    };

    // Generar los datos para el gráfico por tipo y mes
    const generateTipoChartData = (data) => {
        const meses = [...new Set(data.map((item) => `Mes ${item.mes}`))];
        const tipos = [...new Set(data.map((item) => item.tipo))];

        const series = tipos.map((tipo) => ({
            name: tipo,
            data: meses.map((mes) => {
                const item = data.find(
                    (d) => `Mes ${d.mes}` === mes && d.tipo === tipo
                );
                return item ? item.cantidad : 0;
            }),
        }));

        setTipoChartData({ categories: meses, series });
    };

    // Manejar los cambios de filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    // Descargar el reporte en PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Solicitudes", 20, 20);

        autoTable(doc, {
            head: [["ID", "Estado", "Tipo", "Subtipo", "Fecha", "Distrito"]],
            body: filteredReportes.map((r) => [
                r.id_solicitud,
                r.estado,
                r.tipo,
                r.subtipo,
                new Date(r.fecha_creacion).toLocaleString(),
                r.ubicacion?.distrito || "Sin Distrito",
            ]),
        });

        doc.save("reporte-solicitudes.pdf");
    };

    return (
        <div className="container mx-auto px-3 py-8">
            <h1 className="text-2xl font-bold mb-6">Reportes de Solicitudes</h1>

            {/* Filtros */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <input
                    type="number"
                    name="anio"
                    value={filtros.anio}
                    onChange={handleFiltroChange}
                    placeholder="Año"
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="mes"
                    value={filtros.mes}
                    onChange={handleFiltroChange}
                    placeholder="Mes (1-12)"
                    className="border p-2 rounded"
                />
                <select
                    name="tipo"
                    value={filtros.tipo}
                    onChange={handleFiltroChange}
                    className="border p-2 rounded"
                >
                    <option value="">Tipo</option>
                    {tipos.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
                <select
                    name="subtipo"
                    value={filtros.subtipo}
                    onChange={handleFiltroChange}
                    className="border p-2 rounded"
                >
                    <option value="">Subtipo</option>
                    {subtipos.map((subtipo) => (
                        <option key={subtipo} value={subtipo}>
                            {subtipo}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mb-8">
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Buscar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Limpiar
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={downloadPDF}
                >
                    Descargar PDF
                </button>
            </div>

            <h2>Reporte general</h2>
            {/* Gráfico de solicitudes por mes */}
            <div className="mb-8">
                <Chart
                    ref={chartRef}
                    options={{ xaxis: { categories: chartData.categories } }}
                    series={chartData.series}
                    type="bar"
                    height={350}
                />
            </div>

            <h2>Gráfico por tipo y mes</h2>
            {/* Nuevo gráfico por tipo y mes */}
            <div className="mb-8">
                <Chart
                    options={{
                        xaxis: { categories: tipoChartData.categories },
                    }}
                    series={tipoChartData.series}
                    type="bar"
                    height={350}
                />
            </div>

            <h2>Detalle</h2>
            {/* Tabla de resultados */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Estado</th>
                            <th className="border p-2">Tipo</th>
                            <th className="border p-2">Subtipo</th>
                            <th className="border p-2">Fecha</th>
                            <th className="border p-2">Distrito</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReportes.map((r) => (
                            <tr
                                key={r.id_solicitud}
                                className="hover:bg-gray-50"
                            >
                                <td className="border p-2">{r.id_solicitud}</td>
                                <td className="border p-2">{r.estado}</td>
                                <td className="border p-2">{r.tipo}</td>
                                <td className="border p-2">{r.subtipo}</td>
                                <td className="border p-2">
                                    {new Date(
                                        r.fecha_creacion
                                    ).toLocaleString()}
                                </td>
                                <td className="border p-2">
                                    {r.ubicacion?.distrito || "Sin Distrito"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultaReportes;
