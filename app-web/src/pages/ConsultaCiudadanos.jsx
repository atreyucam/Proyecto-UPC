import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiEdit, FiTrash, FiSave, FiEye } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";
import socket from "../services/socket";

const ConsultaCiudadanos = () => {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [filteredCiudadanos, setFilteredCiudadanos] = useState([]);
  const [filtros, setFiltros] = useState({
    zona: "",
    subzona: "",
    canton: "",
    parroquia: "",
  });
  const [zonas, setZonas] = useState([]);
  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [editingCiudadano, setEditingCiudadano] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ciudadanoToDelete, setCiudadanoToDelete] = useState(null);
  const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;




  useEffect(() => {
    const fetchData = async () => {
      try {
        const ciudadanosRes = await axios.get(`${API_URL}/persona/ciudadanos`);
        const zonasRes = await axios.get(`${API_URL}/circuitos/zonas`);

        setCiudadanos(ciudadanosRes.data.ciudadanos);
        setFilteredCiudadanos(ciudadanosRes.data.ciudadanos);
        setZonas(zonasRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // 📡 Escuchar eventos en tiempo real de Socket.IO
  useEffect(() => {
    socket.on("nuevoCiudadano", (nuevoCiudadano) => {
      console.log("🆕 Nuevo ciudadano recibido por socket:", nuevoCiudadano);

      setCiudadanos((prev) => [...prev, nuevoCiudadano]);
      setFilteredCiudadanos((prev) => [...prev, nuevoCiudadano]);
    });

    return () => {
      socket.off("nuevoCiudadano"); // Limpiar el evento al desmontar
    };
  }, []);

  useEffect(() => {
    const fetchSubzonas = async () => {
      if (filtros.zona) {
        try {
          const subzonasRes = await axios.get(`${API_URL}/circuitos/zonas/${filtros.zona}/subzonas`);
          setSubzonas(subzonasRes.data);
        } catch (error) {
          console.error("Error fetching subzonas", error);
        }
      } else {
        setSubzonas([]);
        setCantones([]);
        setParroquias([]);
      }
    };

    fetchSubzonas();
    setFiltros((prevFiltros) => ({ ...prevFiltros, subzona: "", canton: "", parroquia: "" }));
  }, [filtros.zona]);

  useEffect(() => {
    const fetchCantones = async () => {
      if (filtros.subzona) {
        try {
          const cantonesRes = await axios.get(`${API_URL}/circuitos/subzonas/${filtros.subzona}/cantones`);
          setCantones(cantonesRes.data);
        } catch (error) {
          console.error("Error fetching cantones", error);
        }
      } else {
        setCantones([]);
        setParroquias([]);
      }
    };

    fetchCantones();
    setFiltros((prevFiltros) => ({ ...prevFiltros, canton: "", parroquia: "" }));
  }, [filtros.subzona]);

  useEffect(() => {
    const fetchParroquias = async () => {
      if (filtros.canton) {
        try {
          const parroquiasRes = await axios.get(`${API_URL}/circuitos/cantones/${filtros.canton}/distritos`);
          setParroquias(parroquiasRes.data);
        } catch (error) {
          console.error("Error fetching parroquias", error);
        }
      } else {
        setParroquias([]);
      }
    };

    fetchParroquias();
    setFiltros((prevFiltros) => ({ ...prevFiltros, parroquia: "" }));
  }, [filtros.canton]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));
  };

  const handleBuscarClick = () => {
    let filtered = ciudadanos;

    if (filtros.zona) {
      filtered = filtered.filter(
        (ciudadano) =>
          ciudadano.nombre_zona === filtros.zona
      );
    }
    if (filtros.subzona) {
      filtered = filtered.filter(
        (ciudadano) =>
          ciudadano.nombre_subzona === filtros.subzona
      );
    }
    if (filtros.canton) {
      filtered = filtered.filter(
        (ciudadano) =>
          ciudadano.nombre_canton === filtros.canton
      );
    }
    if (filtros.parroquia) {
      filtered = filtered.filter(
        (ciudadano) =>
          ciudadano.nombre_parroquia === filtros.parroquia
      );
    }

    setFilteredCiudadanos(filtered);
  };

  const handleLimpiarClick = () => {
    setFiltros({
      zona: "",
      subzona: "",
      canton: "",
      parroquia: "",
    });
    setFilteredCiudadanos(ciudadanos);
    setSubzonas([]);
    setCantones([]);
    setParroquias([]);
  };

  const handleEditClick = (ciudadano) => {
    setEditingCiudadano(ciudadano);
  };

  const handleSaveClick = async (ciudadano) => {
    try {
      await axios.put(`${API_URL}/personas/${ciudadano.id_persona}`, ciudadano);
      setCiudadanos((prevCiudadanos) =>
        prevCiudadanos.map((c) => (c.id_persona === ciudadano.id_persona ? ciudadano : c))
      );
      setFilteredCiudadanos((prevFiltered) =>
        prevFiltered.map((c) => (c.id_persona === ciudadano.id_persona ? ciudadano : c))
      );
      setEditingCiudadano(null);
    } catch (error) {
      console.error("Error updating ciudadano", error);
    }
  };

  const handleDeleteClick = (ciudadano) => {
    setShowDeleteModal(true);
    setCiudadanoToDelete(ciudadano);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/personas/${ciudadanoToDelete.id_persona}`);
      setCiudadanos((prevCiudadanos) =>
        prevCiudadanos.filter((c) => c.id_persona !== ciudadanoToDelete.id_persona)
      );
      setFilteredCiudadanos((prevFiltered) =>
        prevFiltered.filter((c) => c.id_persona !== ciudadanoToDelete.id_persona)
      );
      setShowDeleteModal(false);
      setCiudadanoToDelete(null);
    } catch (error) {
      console.error("Error deleting ciudadano", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCiudadanoToDelete(null);
  };

  const handleRowClick = (ciudadano) => {
    if (!editingCiudadano) {
      navigate(`/ciudadanos/${ciudadano.id_persona}`);
    }
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de ciudadanos</h1>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-100 rounded-lg">
          <Button
            text="Ciudadanos registrados"
            number={filteredCiudadanos.length}
            icon={<FiCheckCircle size={28} />}
            onClick={() => console.log("Botón Ciudadanos presionado")}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select
            name="zona"
            value={filtros.zona}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          >
            <option value="">Zona</option>
            {zonas.map((zona) => (
              <option key={zona.id_zona} value={zona.nombre_zona}>
                {zona.nombre_zona}
              </option>
            ))}
          </select>
          <select
            name="subzona"
            value={filtros.subzona}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
            disabled={!filtros.zona}
          >
            <option value="">Subzona</option>
            {subzonas.map((subzona) => (
              <option key={subzona.id_subzona} value={subzona.nombre_subzona}>
                {subzona.nombre_subzona}
              </option>
            ))}
          </select>
          <select
            name="canton"
            value={filtros.canton}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
            disabled={!filtros.subzona}
          >
            <option value="">Cantón</option>
            {cantones.map((canton) => (
              <option key={canton.id_canton} value={canton.nombre_canton}>
                {canton.nombre_canton}
              </option>
            ))}
          </select>
          <select
            name="parroquia"
            value={filtros.parroquia}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
            disabled={!filtros.canton}
          >
            <option value="">Parroquia</option>
            {parroquias.map((parroquia) => (
              <option key={parroquia.id_parroquia} value={parroquia.nombre_parroquia}>
                {parroquia.nombre_parroquia}
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

        <h2 className="text-lg font-bold mb-4">Ciudadanos</h2>
        {filteredCiudadanos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border-b p-2">Id</th>
                  <th className="border-b p-2">Cédula</th>
                  <th className="border-b p-2">Nombres</th>
                  <th className="border-b p-2">Apellidos</th>
                  <th className="border-b p-2">Telefono</th>
                  <th className="border-b p-2">Subzona</th>
                  <th className="border-b p-2">Cantón</th>
                  <th className="border-b p-2">Distrito</th>
                  <th className="border-b p-2">Parroquia</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCiudadanos.map((ciudadano) => (
                  <tr key={ciudadano.id_persona} className="hover:bg-gray-50">
                    <td className="border-b p-2 text-center">{ciudadano.id_persona}</td>
                    <td className="border-b p-2 text-center">{ciudadano.cedula}</td>
                    <td className="border-b p-2">
                      {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                        <input
                          type="text"
                          value={editingCiudadano.nombres}
                          onChange={(e) =>
                            setEditingCiudadano((prev) => ({
                              ...prev,
                              nombres: e.target.value,
                            }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        ciudadano.nombres
                      )}
                    </td>
                    <td className="border-b p-2">
                      {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                        <input
                          type="text"
                          value={editingCiudadano.apellidos}
                          onChange={(e) =>
                            setEditingCiudadano((prev) => ({
                              ...prev,
                              apellidos: e.target.value,
                            }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        ciudadano.apellidos
                      )}
                    </td>
                    <td className="border-b p-2 text-center">
                      {ciudadano.telefono}
                    </td>
                    <td className="border-b p-2 text-center">
                      {ciudadano.nombre_subzona}
                    </td>
                    <td className="border-b p-2 text-center">
                      {ciudadano.nombre_canton}
                    </td>
                    <td className="border-b p-2 text-center">
                      {ciudadano.nombre_distrito}
                    </td>
                    <td className="border-b p-2 text-center">
                      {ciudadano.nombre_parroquia}
                    </td>
                    <td className="border-b p-2 flex gap-2 justify-center">
                      {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                        <button
                          onClick={() => handleSaveClick(editingCiudadano)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          <FiSave />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(ciudadano)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          <FiEdit />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(ciudadano)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <FiTrash />
                      </button>
                      <button
                        onClick={() => handleRowClick(ciudadano)}
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
          <p className="text-center mt-4">No existen ciudadanos registrados en dicha parroquia</p>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>
              ¿Está seguro de que desea eliminar a {ciudadanoToDelete?.nombres}{" "}
              {ciudadanoToDelete?.apellidos}?
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
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

export default ConsultaCiudadanos;

