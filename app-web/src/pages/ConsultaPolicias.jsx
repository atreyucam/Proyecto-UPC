import { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiEdit, FiTrash, FiSave, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EstadoBadge from "./components/EstadoBadge"; // Importa el componente

const ConsultaPolicias = () => {
    const [policias, setPolicias] = useState([]);
    const [filteredPolicias, setFilteredPolicias] = useState([]);
    const [filtros, setFiltros] = useState({
        provincia: "",
        ciudad: "",
        barrio: "",
        disponibilidad: "",
    });
    const [provincias, setProvincias] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [editingPolicia, setEditingPolicia] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [policiaToDelete, setPoliciaToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llamada a la API para obtener los datos de los policías
                const policiaRes = await axios.get(
                    "http://localhost:3000/personas/policias"
                );
                setPolicias(policiaRes.data.policias);
                setFilteredPolicias(policiaRes.data.policias);

                // Extraer provincias, ciudades y barrios de los policías
                const uniqueProvincias = [
                    ...new Set(
                        policiaRes.data.policias.map(
                            (policia) => policia.nombre_subzona
                        )
                    ),
                ];
                setProvincias(uniqueProvincias);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (filtros.provincia) {
            const uniqueCiudades = [
                ...new Set(
                    policias
                        .filter(
                            (policia) =>
                                policia.nombre_subzona === filtros.provincia
                        )
                        .map((policia) => policia.nombre_canton)
                ),
            ];
            setCiudades(uniqueCiudades);
        } else {
            setCiudades([]);
        }

        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            ciudad: "",
            barrio: "",
        }));
        setBarrios([]);
    }, [filtros.provincia, policias]);

    useEffect(() => {
        if (filtros.ciudad) {
            const uniqueBarrios = [
                ...new Set(
                    policias
                        .filter(
                            (policia) =>
                                policia.nombre_subzona === filtros.provincia &&
                                policia.nombre_canton === filtros.ciudad
                        )
                        .map((policia) => policia.nombre_distrito)
                ),
            ];
            setBarrios(uniqueBarrios);
        } else {
            setBarrios([]);
        }

        setFiltros((prevFiltros) => ({ ...prevFiltros, barrio: "" }));
    }, [filtros.ciudad, policias]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));
    };

    const handleBuscarClick = () => {
        const filtered = policias.filter(
            (policia) =>
                (filtros.provincia
                    ? policia.nombre_subzona === filtros.provincia
                    : true) &&
                (filtros.ciudad
                    ? policia.nombre_canton === filtros.ciudad
                    : true) &&
                (filtros.barrio
                    ? policia.nombre_distrito === filtros.barrio
                    : true) &&
                (filtros.disponibilidad
                    ? policia.disponibilidad === filtros.disponibilidad
                    : true)
        );
        setFilteredPolicias(filtered);
    };

    const handleLimpiarClick = () => {
        setFiltros({
            provincia: "",
            ciudad: "",
            barrio: "",
            disponibilidad: "",
        });
        setFilteredPolicias(policias);
        setCiudades([]);
        setBarrios([]);
    };

    const handleEditClick = (policia) => {
        setEditingPolicia(policia);
    };

    const handleSaveClick = async (policia) => {
        try {
            await axios.put(
                `http://localhost:3000/personas/${policia.id_persona}`,
                policia
            );
            setPolicias((prevPolicias) =>
                prevPolicias.map((p) =>
                    p.id_persona === policia.id_persona ? policia : p
                )
            );
            setFilteredPolicias((prevFiltered) =>
                prevFiltered.map((p) =>
                    p.id_persona === policia.id_persona ? policia : p
                )
            );
            setEditingPolicia(null);
        } catch (error) {
            console.error("Error updating policia", error);
        }
    };

    const handleDeleteClick = (policia) => {
        setPoliciaToDelete(policia);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        axios
            .delete(
                `http://localhost:3000/personas/${policiaToDelete.id_persona}`
            )
            .then(() => {
                setPolicias(
                    policias.filter(
                        (p) => p.id_persona !== policiaToDelete.id_persona
                    )
                );
                setFilteredPolicias(
                    filteredPolicias.filter(
                        (p) => p.id_persona !== policiaToDelete.id_persona
                    )
                );
                setShowDeleteModal(false);
                setPoliciaToDelete(null);
            })
            .catch((error) => console.error("Error deleting policia:", error));
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPoliciaToDelete(null);
    };

    const handleRowClick = (policia, event) => {
        if (!editingPolicia && event.target.tagName !== "BUTTON") {
            navigate(`/policias/${policia.id_persona}`);
        }
    };

    return (
        <div className="container mx-auto px-3 py-8">
            <h1 className="text-2xl font-bold mb-6">Lista de Policías</h1>
            <div className="grid grid-cols-2 gap-5 justify-center">
                <div className="bg-gray-100 rounded-lg">
                    <Button
                        text="Policías registrados"
                        number={filteredPolicias.length}
                        icon={<FiCheckCircle size={28} />}
                        onClick={() => console.log("Botón Policías presionado")}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-bold mb-4 ">Filtros</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <select
                        name="provincia"
                        value={filtros.provincia}
                        onChange={handleFiltroChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Provincia</option>
                        {provincias.map((provincia) => (
                            <option key={provincia} value={provincia}>
                                {provincia}
                            </option>
                        ))}
                    </select>
                    <select
                        name="ciudad"
                        value={filtros.ciudad}
                        onChange={handleFiltroChange}
                        className="border p-2 rounded"
                        disabled={!filtros.provincia}
                    >
                        <option value="">Ciudad</option>
                        {ciudades.map((ciudad) => (
                            <option key={ciudad} value={ciudad}>
                                {ciudad}
                            </option>
                        ))}
                    </select>
                    <select
                        name="barrio"
                        value={filtros.barrio}
                        onChange={handleFiltroChange}
                        className="border p-2 rounded"
                        disabled={!filtros.ciudad}
                    >
                        <option value="">Subzona</option>
                        {barrios.map((barrio) => (
                            <option key={barrio} value={barrio}>
                                {barrio}
                            </option>
                        ))}
                    </select>
                    <select
                        name="disponibilidad" // Add disponibilidad filter
                        value={filtros.disponibilidad}
                        onChange={handleFiltroChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Disponibilidad</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
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

                <h2 className="text-lg font-bold mb-4">Policías</h2>
                {filteredPolicias.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="border-b p-2 text-center">
                                        ID
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Cédula
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Nombres
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Apellidos
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Teléfono
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Subzona
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Cantón
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Distrito
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Disponibilidad
                                    </th>
                                    <th className="border-b p-2 text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPolicias.map((policia) => (
                                    <tr
                                        key={policia.id_persona}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(policia)} // Navegar al detalle al hacer clic en la fila
                                    >
                                        <td className="border-b p-2 text-center">
                                            {policia.id_persona}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {policia.cedula}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {editingPolicia?.id_persona ===
                                            policia.id_persona ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        editingPolicia.nombres
                                                    }
                                                    onChange={(e) =>
                                                        setEditingPolicia(
                                                            (prev) => ({
                                                                ...prev,
                                                                nombres:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="border p-1 rounded"
                                                />
                                            ) : (
                                                policia.nombres
                                            )}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {editingPolicia?.id_persona ===
                                            policia.id_persona ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        editingPolicia.apellidos
                                                    }
                                                    onChange={(e) =>
                                                        setEditingPolicia(
                                                            (prev) => ({
                                                                ...prev,
                                                                apellidos:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="border p-1 rounded"
                                                />
                                            ) : (
                                                policia.apellidos
                                            )}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {editingPolicia?.id_persona ===
                                            policia.id_persona ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        editingPolicia.telefono
                                                    }
                                                    onChange={(e) =>
                                                        setEditingPolicia(
                                                            (prev) => ({
                                                                ...prev,
                                                                telefono:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="border p-1 rounded"
                                                />
                                            ) : (
                                                policia.telefono
                                            )}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {policia.nombre_subzona}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {policia.nombre_canton}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            {policia.nombre_distrito}
                                        </td>
                                        <td className="border-b p-2 text-center">
                                            <EstadoBadge
                                                estado={policia.disponibilidad}
                                                tipo="disponibilidad"
                                            />
                                        </td>
                                        <td className="border-b p-2 flex gap-2 justify-center">
                                            {editingPolicia?.id_persona ===
                                            policia.id_persona ? (
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // Evita la navegación al hacer clic en "Guardar"
                                                        handleSaveClick(
                                                            editingPolicia
                                                        );
                                                    }}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    <FiSave />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // Evita la navegación al hacer clic en "Editar"
                                                        handleEditClick(
                                                            policia
                                                        );
                                                    }}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                >
                                                    <FiEdit />
                                                </button>
                                            )}
                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation(); // Evita la navegación al hacer clic en "Eliminar"
                                                    handleDeleteClick(policia);
                                                }}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                <FiTrash />
                                            </button>
                                            <button
                                                onClick={(event) => {
                                                    // event.stopPropagation(); // Evita conflictos con el clic en la fila
                                                    handleRowClick(
                                                        policia,
                                                        event
                                                    );
                                                }}
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
                ) : (
                    <p className="text-center mt-4">
                        No se encontraron policías.
                    </p>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <p>
                            ¿Estás seguro de que quieres eliminar a{" "}
                            {policiaToDelete.nombres}{" "}
                            {policiaToDelete.apellidos}?
                        </p>
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={cancelDelete}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

export default ConsultaPolicias;
