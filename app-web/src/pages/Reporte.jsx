import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas"; // <-- Importamos html2canvas
import jsPDF from "jspdf";             // <-- Importamos jsPDF
import autoTable from "jspdf-autotable";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL_LOCAL;
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

    // Estado para manejar datos de "Asesinato", "Femicidio", "Homicidio" y "Sicariato"
    const [homicidiosChartData, setHomicidiosChartData] = useState({
        pie: { series: [], labels: [] },
        stacked: { series: [], categories: [] },
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
                    `${API_URL}estadisticas/solicitudesFiltradas2`,
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

    // NUEVO: Función que captura el contenedor y genera el PDF con todo lo que se ve
    const downloadPDF = async () => {
        try {
            // 1) Seleccionamos el contenedor que queremos "fotografiar"
            const input = document.getElementById("report-content");

            // 2) html2canvas genera un canvas a partir de ese contenedor
            const canvas = await html2canvas(input);

            // 3) Obtenemos la imagen en base64
            const imgData = canvas.toDataURL("image/png");

            // 4) Creamos el documento PDF
            const pdf = new jsPDF("p", "pt", "a4");

            // 5) Calculamos dimensiones para que la imagen ocupe el ancho del PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // 6) Insertamos la imagen en el PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // 7) Descargamos
            pdf.save("reporte-solicitudes.pdf");
        } catch (error) {
            console.error("Error generando PDF:", error);
        }
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

    // Calculamos datos para "Asesinato", "Femicidio", "Homicidio", "Sicariato"
    useEffect(() => {
        const subtiposObjetivo = ["Asesinato", "Femicidio", "Homicidio", "Sicariato"];
        let totals = {
            Asesinato: 0,
            Femicidio: 0,
            Homicidio: 0,
            Sicariato: 0,
        };

        reportes.forEach((item) => {
            if (subtiposObjetivo.includes(item.subtipo_descripcion)) {
                totals[item.subtipo_descripcion] += parseInt(
                    item.total_solicitudes,
                    10
                );
            }
        });

        // Datos para el gráfico de pastel
        const pieSeries = Object.values(totals);
        const pieLabels = Object.keys(totals);

        // Datos para el gráfico de barras apiladas
        const stackedCategories = ["Homicidios Intencionales"];
        const stackedSeries = Object.entries(totals).map(([subtipo, valor]) => ({
            name: subtipo,
            data: [valor],
        }));

        setHomicidiosChartData({
            pie: { series: pieSeries, labels: pieLabels },
            stacked: { series: stackedSeries, categories: stackedCategories },
        });
    }, [reportes]);

    return (
        
        <div id="report-content" className="container mx-auto px-3 py-8">
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
                    Descargar PDF (Pantalla Completa)
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

            {/* Gráfico de Pastel */}
            <h2>Gráfico de Pastel - Homicidios Intencionales</h2>
            <Chart
                options={{
                    labels: homicidiosChartData.pie.labels,
                }}
                series={homicidiosChartData.pie.series}
                type="pie"
                height={350}
            />

            {/* Gráfico de Barras Apiladas (con Porcentajes) */}
            <h2>Gráfico de Barras Apiladas (con Porcentajes)</h2>
            <Chart
                options={{
                    chart: {
                        stacked: true,
                    },
                    xaxis: {
                        categories: homicidiosChartData.stacked.categories,
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (val, opts) => {
                            // Calculamos el total de la categoría
                            const total = opts.w.globals.series
                                .map((serie) => serie[opts.dataPointIndex])
                                .reduce((a, b) => a + b, 0);
                            const percent = ((val / total) * 100).toFixed(2);
                            return `${percent}%`;
                        },
                    },
                }}
                series={homicidiosChartData.stacked.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default ConsultaReportes;
