import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const DesempenoPolicial = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/reportes/desempeno-policial`);
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
            <h2 className="text-xl font-bold mb-4">Desempeño Policial</h2>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border p-2">Policía</th>
                        <th className="border p-2">Total Asignadas</th>
                        <th className="border p-2">Total Resueltas</th>
                        <th className="border p-2">Tiempo Promedio Resolución</th>
                        <th className="border p-2">Disponibilidad</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((policia, index) => (
                        <tr key={index} className="border p-2">
                            <td className="border p-2">{policia.policia}</td>
                            <td className="border p-2">{policia.total_asignadas}</td>
                            <td className="border p-2">{policia.total_resueltas}</td>
                            <td className="border p-2">{policia.tiempo_promedio_resolucion} horas</td>
                            <td className="border p-2">{policia.disponibilidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DesempenoPolicial;
