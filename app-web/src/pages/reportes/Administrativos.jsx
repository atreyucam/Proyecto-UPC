import React, { useEffect, useState } from "react";
import axios from "axios";

  const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;


const Administrativos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [fechaInicio, setFechaInicio] = useState("2025-07-01");
    const [fechaFin, setFechaFin] = useState("2025-07-31");

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/reportes/informes-administrativos`, {
                params: { fechaInicio, fechaFin },
            });
            setData(response.data);
        } catch (err) {
            setError(err.message || "Error al obtener datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Llamada inicial
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                📝 Informes Administrativos
            </h2>

            {/* Filtro de fechas */}
            <div className="flex gap-4 mb-6 items-end">
                <div>
                    <label className="block mb-1 text-sm text-gray-700">Desde:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-gray-700">Hasta:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                >
                    Aplicar Filtro
                </button>
            </div>

            {/* Mensajes de estado */}
            {loading && <p className="text-blue-500 font-medium">Cargando...</p>}
            {error && <p className="text-red-500 font-medium">Error: {error}</p>}

            {/* Tabla de resultados */}
            {!loading && !error && (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-100 text-blue-900 text-left text-sm uppercase tracking-wide">
                                <th className="px-4 py-3">Distrito</th>
                                <th className="px-4 py-3">Cantón</th>
                                <th className="px-4 py-3">Parroquia</th>
                                <th className="px-4 py-3">Total Policías</th>
                                <th className="px-4 py-3">Total Ciudadanos</th>
                                <th className="px-4 py-3">Total Solicitudes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 text-sm border-t">
                                        <td className="px-4 py-2">{item.distrito || "Sin distrito"}</td>
                                        <td className="px-4 py-2">{item.canton || "Sin cantón"}</td>
                                        <td className="px-4 py-2">{item.parroquia || "Sin parroquia"}</td>
                                        <td className="px-4 py-2">{item.total_policias}</td>
                                        <td className="px-4 py-2">{item.total_ciudadanos}</td>
                                        <td className="px-4 py-2">{item.total_solicitudes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No hay datos disponibles para este rango de fechas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Administrativos;
