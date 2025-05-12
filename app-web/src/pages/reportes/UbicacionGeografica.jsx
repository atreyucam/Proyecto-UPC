import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;


const UbicacionGeografica = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/reportes/mapa-incidencias`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Ubicación Geográfica</h2>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border p-2">Punto GPS</th>
                        <th className="border p-2">Tipo</th>
                        <th className="border p-2">Subtipo</th>
                        <th className="border p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((incidencia, index) => (
                        <tr key={index} className="border p-2">
                            <td className="border p-2">{incidencia.puntoGPS}</td>
                            <td className="border p-2">{incidencia.tipo}</td>
                            <td className="border p-2">{incidencia.subtipo}</td>
                            <td className="border p-2">{incidencia.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UbicacionGeografica;
