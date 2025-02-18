import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import PropTypes from "prop-types";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiUserCheck,
    FiShield,
    FiSmile,
    FiFlag,
    FiEye,
} from "react-icons/fi";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import EstadoBadge from "./components/EstadoBadge"; // Importa el componente

// Función para determinar las clases de color en base al estado
const getBadgeClass = (estado) => {
    switch (estado) {
        case "Pendiente":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
        case "En progreso":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900";
        case "Resuelto":
            return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
        case "Falso":
            return "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900";
    }
};

const Button = ({
    text,
    subText = "",
    number = null,
    onClick,
    icon,
    estado,
}) => {
    const badgeClass = getBadgeClass(estado);

    return (
        <button
            className={`w-full h-full ${badgeClass} p-4 rounded-lg shadow-md flex flex-col items-start justify-between transition duration-300`}
            onClick={onClick}
        >
            <div className="text-left flex justify-between items-center w-full">
                <div>
                    <span className="block text-lg font-bold">{text}</span>
                    <span className="block text-sm">{subText}</span>
                    {number !== null && (
                        <span className="block text-lg font-bold">
                            {number}
                        </span>
                    )}
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
    estado: PropTypes.string,
};

const Home = () => {
    const [stats, setStats] = useState({});
    const [barSeries, setBarSeries] = useState([]);
    const [topSolicitudes, setTopSolicitudes] = useState([]);
    const [ContadoresPorTipo, setContadoresPorTipo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/estadisticas/contadorSolicitudesTotales"
                );
                const data = response.data;
                setStats(data);

                // Definir todos los meses en español
                const meses = [
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

                // Inicializar los tipos únicos de solicitudes
                const tiposUnicos = new Set();
                meses.forEach((mes) => {
                    (data.porMes[mes] || []).forEach((item) => {
                        tiposUnicos.add(item.tipo_descripcion);
                    });
                });

                // Construir las series para el gráfico de barras
                const series = Array.from(tiposUnicos).map((tipo) => {
                    const dataSerie = meses.map((mes) => {
                        const item = data.porMes[mes]?.find(
                            (i) => i.tipo_descripcion === tipo
                        );
                        return item ? item.count : 0; // Rellenar con 0 si no hay datos
                    });
                    return { name: tipo, data: dataSerie };
                });

                // Actualizar las opciones del gráfico de barras
                setBarOptions((prevOptions) => ({
                    ...prevOptions,
                    xaxis: { categories: meses },
                }));
                setBarSeries(series);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        const fetchTopSolicitudes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/solicitud/top10solicitudes"
                );
                setTopSolicitudes(response.data);
            } catch (error) {
                console.error("Error fetching top solicitudes:", error);
            }
        };

        fetchStats();
        fetchTopSolicitudes();

        const fetchContadorPorTipo = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/estadisticas/tiposTotales"
                );
                setContadoresPorTipo(response.data);
            } catch (error) {
                console.error("Error al obtener contadores por tipo:", error);
            }
        };

        fetchContadorPorTipo();
    }, []);

    // Datos y opciones del gráfico de pastel
    // Calcular los totales para el gráfico de pastel
    const botonEmergencia =
        ContadoresPorTipo.find(
            (tipo) => tipo.tipo_descripcion === "Boton de emergencia"
        )?.count || 0;
    const denunciasCiudadanas =
        ContadoresPorTipo.find(
            (tipo) => tipo.tipo_descripcion === "Denuncia Ciudadana"
        )?.count || 0;
    const serviciosComunitarios =
        ContadoresPorTipo.find(
            (tipo) => tipo.tipo_descripcion === "Servicios comunitarios"
        )?.count || 0;

    // Datos del gráfico de pastel
    const pieChartData = [
        botonEmergencia,
        denunciasCiudadanas,
        serviciosComunitarios,
    ];
    const pieChartOptions = {
        chart: {
            type: "pie",
            width: "100%",
            height: "100%",
        },
        labels: [
            "Botón de Emergencia",
            "Denuncias Ciudadanas",
            "Servicios Comunitarios",
        ],
        colors: ["#EF4444", "#EAB308", "#22C55E"], // Opcional: Colores personalizados
        legend: {
            position: "left", // Cambiar posición a la izquierda
            horizontalAlign: "center",

            labels: {
                useSeriesColors: true, // Opcional: Muestra los colores de la serie en las leyendas
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    legend: {
                        position: "bottom", // En pantallas pequeñas la leyenda se mueve abajo
                    },
                },
            },
        ],
    };

    // Datos y opciones del gráfico de líneas
    const [barOptions, setBarOptions] = useState({
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                endingShape: "rounded",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ],
        },
        yaxis: {
            title: {
                text: "Solicitudes",
            },
        },
        fill: {
            opacity: 1,
        },
        colors: ["#EF4444", "#EAB308", "#22C55E"], // Colores personalizados
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " solicitudes";
                },
            },
        },
    });

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
                        number={stats.total?.count || 0}
                        icon={<FiUserCheck size={24} />}
                        onClick={() =>
                            console.log("Botón Total Solicitudes presionado")
                        }
                    />
                </div>
                <div className="p-5 bg-gray-100 rounded-lg">
                    <Button
                        text="Solicitudes Resueltas"
                        estado="Resuelto"
                        number={
                            stats.byStatus?.counts?.["Solicitudes resueltas"] ||
                            0
                        }
                        icon={<FiCheckCircle size={24} />}
                        onClick={() =>
                            console.log(
                                "Botón Solicitudes Resueltas presionado"
                            )
                        }
                    />
                </div>
                <div className="p-5 bg-gray-100 rounded-lg">
                    <Button
                        text="Solicitudes Pendientes"
                        estado="Pendiente"
                        number={
                            stats.byStatus?.counts?.[
                                "Solicitudes pendientes"
                            ] || 0
                        }
                        icon={<FiSmile size={24} />}
                        onClick={() =>
                            console.log(
                                "Botón Solicitudes Pendientes presionado"
                            )
                        }
                    />
                </div>
                <div className="p-5 bg-gray-100 rounded-lg">
                    <Button
                        text="Solicitudes en Progreso"
                        estado="En progreso"
                        number={
                            stats.byStatus?.counts?.[
                                "Solicitudes en Progreso"
                            ] || 0
                        }
                        icon={<FiShield size={24} />}
                        onClick={() =>
                            console.log(
                                "Botón Solicitudes en Progreso presionado"
                            )
                        }
                    />
                </div>
                <div className="p-5 bg-gray-100 rounded-lg">
                    <Button
                        text="Solicitudes Falsas"
                        estado="Falso"
                        number={
                            stats.byStatus?.counts?.["Solicitudes falsas"] || 0
                        }
                        icon={<FiFlag size={24} />}
                        onClick={() =>
                            console.log("Botón Solicitudes Falsas presionado")
                        }
                    />
                </div>
            </div>

            {/* Contadores por tipo de solicitud */}
            <h2 className="text-lg font-bold mb-4">
                Registro por tipo de solicitud
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.porTipoSolicitud?.map((tipo) => (
                    <div
                        key={tipo.id_tipo}
                        className="bg-white p-4 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <div className="mr-3">
                                <FiAlertCircle size={20} color="#007bff" />
                            </div>
                            <div>
                                <p className="text-base font-bold">
                                    {tipo.tipo_descripcion}
                                </p>
                                <p className="text-sm">{tipo.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cajas de resumen por tipo de solicitud */}
            <h2 className="text-lg font-bold mb-4">
                Resumen por tipo de solicitud
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <span className="font-bold">Botón de Emergencia</span>
                    <span>
                        {ContadoresPorTipo.find(
                            (tipo) =>
                                tipo.tipo_descripcion === "Boton de emergencia"
                        )?.count || 0}
                    </span>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <span className="font-bold">Denuncias Ciudadanas</span>
                    <span>
                        {ContadoresPorTipo.find(
                            (tipo) =>
                                tipo.tipo_descripcion === "Denuncia Ciudadana"
                        )?.count || 0}
                    </span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <span className="font-bold">Servicios Comunitarios</span>
                    <span>
                        {ContadoresPorTipo.find(
                            (tipo) =>
                                tipo.tipo_descripcion ===
                                "Servicios comunitarios"
                        )?.count || 0}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8"></div>
            {/* Gráfico de barras */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <ApexCharts
                    options={barOptions}
                    series={barSeries}
                    type="bar"
                    height={350}
                />
            </div>
            <br />
            {/* Gráfico de Pastel */}
            <div className="grid w-full gap-4">
                <div className="flex flex-col justify-center items-start bg-white p-4 rounded-lg shadow-md ">
                    {/* Leyendas a la izquierda */}
                    <div className="flex flex-col justify-center mr-6">
                        <h2 className="text-lg font-bold mb-4">
                            Distribución de solicitudes
                        </h2>
                    </div>

                    {/* Gráfico de Pastel */}
                    <div className="flex justify-center items-center bg-white p-4 rounded-lg ">
                        <ApexCharts
                            options={pieChartOptions}
                            series={pieChartData}
                            type="pie"
                            height={350}
                            width={450}
                        />
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
                                <th className="py-2 px-4 text-left">
                                    ID Solicitud
                                </th>
                                <th className="py-2 px-4 text-left">Estado</th>
                                <th className="py-2 px-4 text-left">Subtipo</th>
                                <th className="py-2 px-4 text-left">Fecha</th>
                                <th className="py-2 px-4 text-left">
                                    Distrito
                                </th>
                                {/* <th className="py-2 px-4 text-left">Cantón</th>
                                <th className="py-2 px-4 text-left">Subzona</th> */}
                                <th className="py-2 px-4 text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSolicitudes.map((solicitud) => (
                                <tr key={solicitud.id_solicitud}>
                                    <td className="py-2 px-4">
                                        {solicitud.id_solicitud}
                                    </td>
                                    <td className="py-2 px-4">
                                        <EstadoBadge
                                            estado={solicitud.estado}
                                            tipo="estado"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        {solicitud.subtipo}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Date(
                                            solicitud.fecha_creacion
                                        ).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        {solicitud.ubicacion?.distrito ||
                                            "Sin Distrito"}
                                    </td>
                                    {/* <td className="py-2 px-4">{solicitud.ubicacion?.canton || 'Sin Cantón'}</td>
                  <td className="py-2 px-4">{solicitud.ubicacion?.subzona || 'Sin Subzona'}</td> */}
                                    <td className="py-2 px-4 flex gap-2 justify-center">
                                        <button
                                            onClick={() =>
                                                handleRowClick(solicitud)
                                            }
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
