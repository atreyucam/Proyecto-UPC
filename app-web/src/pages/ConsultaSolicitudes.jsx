import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EstadoBadge from "./components/EstadoBadge"; // Importa el componente
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const socket = io(`${API_URL}`); // Conectar al servidor Socket.IO

const ConsultaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [filtros, setFiltros] = useState({
        estado: "",
        tipo: "",
        subtipo: "",
    });

    const [tipos, setTipos] = useState([]);
    const [subtipos, setSubtipos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/solicitud/`
                );
                setSolicitudes(response.data);
                setFilteredSolicitudes(response.data);

                // Obtener listas únicas de tipos y subtipos
                const uniqueTipos = [
                    ...new Set(response.data.map((s) => s.tipo)),
                ];
                setTipos(uniqueTipos);

                const uniqueSubtipos = [
                    ...new Set(response.data.map((s) => s.subtipo)),
                ];
                setSubtipos(uniqueSubtipos);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();

        // Escuchar eventos de Socket.IO
        socket.on("nuevaSolicitud", (nuevaSolicitud) => {
            handleSocketUpdate(nuevaSolicitud);
        });

        socket.on("nuevoBotonEmergencia", (nuevoBotonEmergencia) => {
            handleSocketUpdate(nuevoBotonEmergencia);
        });

        socket.on("actualizarSolicitud", (data) => {
            console.log("Solicitud actualizada:", data);
            actualizarEstadoEnUI(data);
        });

        socket.on("solicitudCerrada", (data) => {
            actualizarEstadoEnUI(data);
        });

        return () => {
            socket.off("nuevaSolicitud");
            socket.off("nuevoBotonEmergencia");
            socket.off("actualizarSolicitud");
            socket.off("solicitudCerrada");
        };
    }, []);

    const handleSocketUpdate = async (solicitud) => {
        try {
            const response = await axios.get(
                `${API_URL}/solicitud/${solicitud.id_solicitud}`
            );
            const solicitudCompleta = response.data;
            setSolicitudes((prev) => [solicitudCompleta, ...prev]);
            setFilteredSolicitudes((prev) => [solicitudCompleta, ...prev]);
        } catch (error) {
            console.error("Error al obtener detalles de la solicitud", error);
        }
    };

    const actualizarEstadoEnUI = (data) => {
        setSolicitudes((prevSolicitudes) =>
            prevSolicitudes.map((solicitud) =>
                solicitud.id_solicitud === data.id_solicitud
                    ? { ...solicitud, estado: data.estado, policia_asignado: data.policia_asignado }
                    : solicitud
            )
        );
    
        setFilteredSolicitudes((prevSolicitudes) =>
            prevSolicitudes.map((solicitud) =>
                solicitud.id_solicitud === data.id_solicitud
                    ? { ...solicitud, estado: data.estado, policia_asignado: data.policia_asignado }
                    : solicitud
            )
        );
    };
    
    

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarClick = () => {
        const filtered = solicitudes.filter(
            (solicitud) =>
                (filtros.estado ? solicitud.estado === filtros.estado : true) &&
                (filtros.tipo ? solicitud.tipo === filtros.tipo : true) &&
                (filtros.subtipo ? solicitud.subtipo === filtros.subtipo : true)
        );
        setFilteredSolicitudes(filtered);
    };

    const handleLimpiarClick = () => {
        setFiltros({ estado: "", tipo: "", subtipo: "" });
        setFilteredSolicitudes(solicitudes);
    };

    const handleRowClick = (solicitud) => {
        navigate(`/solicitudes/${solicitud.id_solicitud}`);
    };

    return (
        <div className="container mx-auto px-3 py-8">
            <h1 className="text-2xl font-bold mb-6">Lista de Solicitudes</h1>

            <div className="grid grid-cols-2 gap-5">
                <div className="bg-gray-100 rounded-lg">
                    <Button
                        text="Solicitudes registradas"
                        number={filteredSolicitudes.length}
                        icon={<FiCheckCircle size={28} />}
                        onClick={() =>
                            console.log("Botón solicitudes presionado")
                        }
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Filtros</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <select
                        name="estado"
                        value={filtros.estado}
                        onChange={handleFiltroChange}
                        className="border p-2 rounded"
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Resuelto">Resuelto</option>
                    </select>
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

                    <div className="flex gap-4">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={handleBuscarClick}
                        >
                            Buscar
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={handleLimpiarClick}
                        >
                            Limpiar Filtro
                        </button>
                    </div>
                </div>

                <h2 className="text-lg font-bold mb-4">Solicitudes</h2>
                {filteredSolicitudes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="border-b p-2">
                                        ID Solicitud
                                    </th>
                                    <th className="border-b p-2">Estado</th>
                                    <th className="border-b p-2">Tipo</th>
                                    <th className="border-b p-2">Subtipo</th>
                                    <th className="border-b p-2">
                                        Fecha de Creación
                                    </th>
                                    <th className="border-b p-2">
                                        Policía Asignado
                                    </th>
                                    <th className="border-b p-2">Distrito</th>
                                    {/* <th className="border-b p-2">Cantón</th>
                                    <th className="border-b p-2">Subzona</th> */}
                                    <th className="border-b p-2">Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSolicitudes.map((solicitud) => (
                                    <tr
                                        key={solicitud.id_solicitud}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            handleRowClick(solicitud)
                                        }
                                    >
                                        <td className="border-b p-2 text-center">
                                            {solicitud.id_solicitud}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            <EstadoBadge
                                                estado={solicitud.estado}
                                                tipo="estado"
                                            />
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {solicitud.tipo}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {solicitud.subtipo}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {new Date(
                                                solicitud.fecha_creacion
                                            ).toLocaleString()}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {solicitud.policia_asignado}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {solicitud.ubicacion?.distrito ||
                                                "Sin Distrito"}
                                        </td>
                                        {/* <td className="border-b p-2 text-center">
                                            {solicitud.ubicacion?.canton ||
                                                "Sin Cantón"}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {solicitud.ubicacion?.subzona ||
                                                "Sin Subzona"}
                                        </td> */}
                                        <td className="border-b p-2">
                                            <button className="bg-green-500 text-white px-2 py-1 rounded">
                                                <FiEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center mt-4">
                        No existen solicitudes registradas
                    </p>
                )}
            </div>
        </div>
    );
};

const Button = ({ text, number, icon, onClick }) => (
    <button
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-between w-full"
        onClick={onClick}
    >
        <div className="flex items-center gap-2">
            {icon}
            <span>{text}</span>
        </div>
        <span>{number}</span>
    </button>
);

export default ConsultaSolicitudes;
