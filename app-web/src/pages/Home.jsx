import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { FiUserCheck, FiCheckCircle, FiSmile, FiShield, FiFlag, FiEye } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import EstadoBadge from "./components/EstadoBadge";

// Definir la URL de la API
const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

// Opciones de períodos predefinidos
const PERIODOS = [
    { label: "Mes Actual", value: "mes_actual" },
    { label: "Últimos 3 Meses", value: "ultimos_3_meses" },
    { label: "Últimos 6 Meses", value: "ultimos_6_meses" },
    { label: "Este Año", value: "este_anio" }
];

const obtenerMeses = (periodo) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    
    switch (periodo) {
        case "mes_actual":
            return [meses[mesActual]];
        case "ultimos_3_meses":
            return meses.slice(Math.max(0, mesActual - 2), mesActual + 1);
        case "ultimos_6_meses":
            return meses.slice(Math.max(0, mesActual - 5), mesActual + 1);
        case "este_anio":
            return meses;
        default:
            return [];
    }
};
const obtenerTituloPeriodo = (periodo) => {
    const meses = obtenerMeses(periodo);
    return `Periodo: ${meses.length > 1 ? `${meses[0]} - ${meses[meses.length - 1]}` : meses[0]}`;
};



const Home = () => {
    const [periodo, setPeriodo] = useState("mes_actual");
    const [stats, setStats] = useState({});
    const [barSeries, setBarSeries] = useState([]);
    const [topSolicitudes, setTopSolicitudes] = useState([]);
    const [contadoresPorTipo, setContadoresPorTipo] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, solicitudesRes, tiposRes] = await Promise.all([
                    axios.get(`${API_URL}/estadisticas/solicitudesPorEstado?periodo=${periodo}`),
                    axios.get(`${API_URL}/estadisticas/top10Solicitudes?periodo=${periodo}`),
                    axios.get(`${API_URL}/estadisticas/solicitudes-por-tipo?periodo=${periodo}`),
                ]);

                setStats(statsRes.data);
                setTopSolicitudes(solicitudesRes.data || []);

                const meses = obtenerMeses(periodo);
                const tiposUnicos = new Set();

                meses.forEach((mes) => {
                    (tiposRes.data[mes] || []).forEach((item) => tiposUnicos.add(item.tipo));
                });

                const series = Array.from(tiposUnicos).map((tipo) => ({
                    name: tipo,
                    data: meses.map((mes) => {
                        const mesData = tiposRes.data[mes] || [];
                        const item = mesData.find((i) => i.tipo === tipo);
                        return item ? parseInt(item.total, 10) : 0;
                    }),
                }));

                
                const nuevosContadores = [];
// `tiposRes.data` puede ser un objeto con meses como claves
Object.values(tiposRes.data).forEach((mesData) => {
    mesData.forEach((tipo) => {
        const index = nuevosContadores.findIndex(t => t.tipo === tipo.tipo);
        if (index !== -1) {
            nuevosContadores[index].total += parseInt(tipo.total, 10);
        } else {
            nuevosContadores.push({ tipo: tipo.tipo, total: parseInt(tipo.total, 10) });
        }
    });
});

console.log("📊 Tipos de solicitud cargados:", nuevosContadores);
setContadoresPorTipo(nuevosContadores);


                setBarSeries(series);
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
            }
        };

        fetchData();
    }, [periodo]);
    

    // Manejar clic en fila de solicitud
    const handleRowClick = (solicitud) => {
        navigate(`/solicitudes/${solicitud.id_solicitud}`);
    };

    return (
        <div className="container mx-auto px-3 py-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{obtenerTituloPeriodo(periodo)}</h2>
            <select
                className="border p-2 rounded-md"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
            >
                {PERIODOS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                ))}
            </select>
        </div>

            {/* Botones de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                <Button text="Total Solicitudes" number={stats.total || 0} icon={<FiUserCheck size={24} />} />
                <Button text="Solicitudes Resueltas" estado="Resuelto" number={stats.resueltas || 0} icon={<FiCheckCircle size={24} />} />
                <Button text="Solicitudes Pendientes" estado="Pendiente" number={stats.pendientes || 0} icon={<FiSmile size={24} />} />
                <Button text="Solicitudes en Progreso" estado="En progreso" number={stats.en_progreso || 0} icon={<FiShield size={24} />} />
                <Button text="Solicitudes Falsas" estado="Falso" number={stats.falsas || 0} icon={<FiFlag size={24} />} />
            </div>

            {/* Registro por tipo de solicitud */}
            <h2 className="text-lg font-bold mb-4">Registro por tipo de solicitud</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {contadoresPorTipo.map((tipo) => (
                    <div key={tipo.tipo} className="bg-white p-4 rounded-lg shadow-md">
                        <span className="font-bold">{tipo.tipo}</span>
                        <span className="block text-sm">{tipo.total}</span>
                    </div>
                ))}
            </div>

           {/* Gráfico de Barras */}
           <h2 className="text-lg font-bold mb-4">Distribución del periodo</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                {barSeries.length === 0 ? (
                    <p className="text-center text-gray-500">No hay datos que mostrar</p>
                ) : (
                    <ApexCharts
                        options={{
                            chart: { type: "bar", height: 350 },
                            xaxis: { categories: obtenerMeses(periodo) },
                            yaxis: { title: { text: "Solicitudes" } },
                            legend: { position: "bottom" },
                            tooltip: { y: { formatter: (val) => `${val} solicitudes` } },
                        }}
                        series={barSeries}
                        type="bar"
                        height={350}
                    />
                )}
            </div>
            
            {/* Tabla de Actividad Reciente */}
<h2 className="text-lg font-bold mt-8 mb-4">Actividad Reciente</h2>
<div className="overflow-x-auto">
    <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
        <thead>
            <tr className="border-b">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Estado</th>
                <th className="py-2 px-4 text-left">Tipo</th>
                <th className="py-2 px-4 text-left">Subtipo</th>
                <th className="py-2 px-4 text-left">Creado Por</th>
                <th className="py-2 px-4 text-left">Policía Asignado</th>
                <th className="py-2 px-4 text-left">Fecha</th>
                <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {topSolicitudes.map((s) => (
                <tr key={s.id_solicitud} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(s)}>
                    <td className="py-2 px-4">{s.id_solicitud}</td>
                    <td className="py-2 px-4"><EstadoBadge estado={s.estado} /></td>
                    <td className="py-2 px-4">{s.tipo}</td>
                    <td className="py-2 px-4">{s.subtipo}</td>
                    <td className="py-2 px-4">{s.creado_por}</td>
                    <td className="py-2 px-4">{s.policia_asignado}</td>
                    <td className="py-2 px-4">{new Date(s.fecha_creacion).toLocaleString()}</td>
                    <td className="py-2 px-4">
                        <button 
                            onClick={() => handleRowClick(s)} 
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <FiEye size={20} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

        </div>
    );
};

export default Home;
