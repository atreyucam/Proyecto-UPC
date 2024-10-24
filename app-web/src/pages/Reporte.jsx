import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const ConsultaReportes = () => {
    const chartRef = useRef(null);

    const [reportes, setReportes] = useState([]);
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [tipoChartData, setTipoChartData] = useState({
        categories: [],
        series: [],
    });
    const [subtiposPorTipo, setSubtiposPorTipo] = useState([]);

    const [filtros, setFiltros] = useState({
        anio: new Date().getFullYear(),
        mes: "",
        tipo: "",
        subtipo: "",
        rangoMesInicio: "",
        rangoMesFin: "",
    });

    const getMonthName = (monthNumber) => {
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        return months[monthNumber - 1];
    };

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/estadisticas/solicitudesFiltradas2",
                    { params: filtros }
                );

                const { solicitudes, calculosPorTipo } = response.data;
                // Aseguramos que las variaciones sean numéricas.
                const calculosLimpios = calculosPorTipo.map((tipo) => ({
                    ...tipo,
                    subtipos: tipo.subtipos.map((sub) => ({
                        ...sub,
                        variacion:
                            typeof sub.variacion === "number"
                                ? sub.variacion
                                : parseFloat(sub.variacion) || 0,
                    })),
                }));

                setReportes(solicitudes); // Guardamos las solicitudes en el estado
                generateChartData(solicitudes);
                generateTipoChartData(solicitudes);
                setSubtiposPorTipo(calculosLimpios); // Guardamos los cálculos para las tablas
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        fetchReportes();
    }, [filtros]);

    const generateChartData = (data) => {
        const aggregatedData = data.reduce((acc, item) => {
            acc[item.mes] =
                (acc[item.mes] || 0) + parseInt(item.total_solicitudes);
            return acc;
        }, {});

        const categories = Object.keys(aggregatedData).map((mes) =>
            getMonthName(parseInt(mes))
        );
        const series = [
            {
                name: "Total de Solicitudes",
                data: Object.values(aggregatedData),
            },
        ];

        setChartData({ categories, series });
    };

    const generateTipoChartData = (data) => {
        const tipos = [...new Set(data.map((item) => item.tipo_descripcion))];
        const meses = [...new Set(data.map((item) => getMonthName(item.mes)))];

        const series = tipos.map((tipo) => ({
            name: tipo,
            data: meses.map((mes) => {
                const solicitud = data.find(
                    (item) =>
                        getMonthName(item.mes) === mes &&
                        item.tipo_descripcion === tipo
                );
                return solicitud ? parseInt(solicitud.total_solicitudes) : 0;
            }),
        }));

        setTipoChartData({ categories: meses, series });
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Solicitudes", 20, 20);

        autoTable(doc, {
            head: [["ID", "Estado", "Tipo", "Subtipo", "Fecha", "Distrito"]],
            body: reportes.map((r) => [
                r.id_solicitud,
                r.estado,
                r.tipo_descripcion,
                r.subtipo_descripcion,
                new Date(r.fecha_creacion).toLocaleString(),
                r.ubicacion?.distrito || "Sin Distrito",
            ]),
        });

        doc.save("reporte-solicitudes.pdf");
    };
    const homicidiosIntencionales = [
        "Asesinato",
        "Femicidio",
        "Homicidio",
        "Sicariato",
    ];

    const renderTablasPorTipo = () => {
        const { rangoMesInicio, rangoMesFin } = filtros;

        if (rangoMesInicio && rangoMesFin) {
            return (
                <>
                    {renderTablaHomicidiosIntencionales()}
                    {renderTablasPorTipoConRango()}
                </>
            );
        } else {
            return (
                <>
                    {renderTablaHomicidiosIntencionales()}
                    {renderTablaSimple()}
                </>
            );
        }
    };
    const renderTablaSimple = () => {
        const filtrados = reportes.filter(
            (r) => !homicidiosIntencionales.includes(r.subtipo_descripcion)
        );

        if (filtrados.length === 0) {
            return <p>No hay datos disponibles para mostrar.</p>;
        }
        // Verificar si hay datos disponibles en 'reportes'
        if (!reportes || reportes.length === 0) {
            return <p>No hay datos disponibles para mostrar.</p>;
        }

        // Agrupar solicitudes por tipo y subtipo
        const agrupadoPorTipo = reportes.reduce((acc, solicitud) => {
            const {
                tipo_descripcion: tipo,
                subtipo_descripcion: subtipo,
                total_solicitudes,
            } = solicitud;

            if (!acc[tipo]) {
                acc[tipo] = {
                    tipo,
                    subtipos: {},
                };
            }

            // Inicializar subtipo si no existe
            if (!acc[tipo].subtipos[subtipo]) {
                acc[tipo].subtipos[subtipo] = 0;
            }

            // Sumar las solicitudes de cada subtipo
            acc[tipo].subtipos[subtipo] += parseInt(total_solicitudes, 10);

            return acc;
        }, {});

        // Renderizar tablas por cada tipo de solicitud
        return Object.values(agrupadoPorTipo).map(({ tipo, subtipos }) => {
            const totalFrecuencia = Object.values(subtipos).reduce(
                (acc, frecuencia) => acc + frecuencia,
                0
            );

            return (
                <div key={tipo} className="mb-8">
                    <h3 className="text-xl font-bold mb-4">{tipo}</h3>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className="border p-2">Subtipo</th>
                                <th className="border p-2">Frecuencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(subtipos).map(
                                ([subtipo, frecuencia]) => (
                                    <tr
                                        key={subtipo}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border p-2">
                                            {subtipo}
                                        </td>
                                        <td className="border p-2">
                                            {frecuencia}
                                        </td>
                                    </tr>
                                )
                            )}
                            <tr className="font-bold">
                                <td className="border p-2">Total</td>
                                <td className="border p-2">
                                    {totalFrecuencia}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        });
    };

    const renderTablasPorTipoConRango = () => {
        return subtiposPorTipo.map(
            ({ tipo, subtipos, totalInicio, totalFin, variacion }) => (
                <div key={tipo} className="mb-8">
                    <h3 className="text-xl font-bold mb-4">{tipo}</h3>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className="border p-2">Subtipo</th>
                                <th className="border p-2">
                                    Frecuencia (Mes Inicio)
                                </th>
                                <th className="border p-2">
                                    Frecuencia (Mes Fin)
                                </th>
                                <th className="border p-2">Variación (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subtipos.map(
                                ({ subtipo, inicio, fin, variacion }) => (
                                    <tr
                                        key={subtipo}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border p-2">
                                            {subtipo}
                                        </td>
                                        <td className="border p-2">{inicio}</td>
                                        <td className="border p-2">{fin}</td>
                                        <td
                                            className={`border p-2 ${
                                                !isNaN(variacion) &&
                                                parseFloat(variacion) >= 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {isNaN(variacion)
                                                ? "N/A"
                                                : parseFloat(variacion).toFixed(
                                                      2
                                                  )}
                                            %
                                        </td>
                                    </tr>
                                )
                            )}
                            <tr className="font-bold">
                                <td className="border p-2">Total</td>
                                <td className="border p-2">{totalInicio}</td>
                                <td className="border p-2">{totalFin}</td>
                                <td
                                    className={`border p-2 ${
                                        variacion >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {variacion.toFixed(2)}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        );
    };
    const renderTablaHomicidiosIntencionales = () => {
        const homicidios = subtiposPorTipo.find(
            (tipo) => tipo.tipo === "Homicidios Intencionales"
        );

        if (!homicidios || homicidios.subtipos.length === 0) {
            return <p>No hay homicidios intencionales disponibles.</p>;
        }

        const { totalInicio, totalFin, variacion, subtipos } = homicidios;

        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                    Homicidios Intencionales
                </h3>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="border p-2">Subtipo</th>
                            <th className="border p-2">
                                Frecuencia (Mes Inicio)
                            </th>
                            <th className="border p-2">Frecuencia (Mes Fin)</th>
                            <th className="border p-2">Variación (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subtipos.map(({ subtipo, inicio, fin, variacion }) => (
                            <tr key={subtipo} className="hover:bg-gray-50">
                                <td className="border p-2">{subtipo}</td>
                                <td className="border p-2">{inicio}</td>
                                <td className="border p-2">{fin}</td>
                                <td
                                    className={`border p-2 ${
                                        !isNaN(variacion) &&
                                        parseFloat(variacion) >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {isNaN(variacion)
                                        ? "N/A"
                                        : parseFloat(variacion).toFixed(2)}
                                    %
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold">
                            <td className="border p-2">Total</td>
                            <td className="border p-2" colSpan={3}>
                                {totalInicio + totalFin}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
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
                    name="rangoMesInicio"
                    value={filtros.rangoMesInicio}
                    onChange={handleFiltroChange}
                    placeholder="Mes Inicio"
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="rangoMesFin"
                    value={filtros.rangoMesFin}
                    onChange={handleFiltroChange}
                    placeholder="Mes Fin"
                    className="border p-2 rounded"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-4 mb-8">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={downloadPDF}
                >
                    Descargar PDF
                </button>
            </div>

            <h2>Reporte General</h2>
            <Chart
                ref={chartRef}
                options={{ xaxis: { categories: chartData.categories } }}
                series={chartData.series}
                type="bar"
                height={350}
            />

            <h2>Gráfico por Tipo y Mes</h2>
            <Chart
                options={{ xaxis: { categories: tipoChartData.categories } }}
                series={tipoChartData.series}
                type="bar"
                height={350}
            />

            <h2>Detalle por Tipo de Solicitud</h2>
            {renderTablasPorTipo()}
        </div>
    );
};

export default ConsultaReportes;
