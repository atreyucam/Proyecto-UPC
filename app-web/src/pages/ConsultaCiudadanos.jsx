import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiEdit, FiSave, FiXCircle, FiTrash, FiEye } from "react-icons/fi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ConsultaCircuito = () => {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [filteredCiudadanos, setFilteredCiudadanos] = useState([]);
  const [filtros, setFiltros] = useState({
    provincia: "",
    ciudad: "",
    barrio: "",
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [editingCiudadano, setEditingCiudadano] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ciudadanoToDelete, setCiudadanoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ciudadanosRes = await axios.get("http://localhost:3000/api/ciudadanos");
        const provinciasRes = await axios.get("http://localhost:3000/api/provincias");

        setCiudadanos(ciudadanosRes.data);
        setFilteredCiudadanos(ciudadanosRes.data);
        setProvincias(provinciasRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleFiltroChange = async (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));

    if (name === "provincia") {
      const ciudadesRes = await axios.get(`http://localhost:3000/api/ciudades/${value}`);
      setCiudades(ciudadesRes.data);
      setBarrios([]);
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ciudad: "",
        barrio: "",
      }));
    } else if (name === "ciudad") {
      const barriosRes = await axios.get(`http://localhost:3000/api/barrios/${filtros.provincia}/${value}`);
      setBarrios(barriosRes.data);
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        barrio: "",
      }));
    }
  };

  const handleBuscarClick = () => {
    let filtered = ciudadanos;

    if (filtros.provincia) {
      filtered = filtered.filter((ciudadano) => ciudadano.Circuito.provincia === filtros.provincia);
    }
    if (filtros.ciudad) {
      filtered = filtered.filter((ciudadano) => ciudadano.Circuito.ciudad === filtros.ciudad);
    }
    if (filtros.barrio) {
      filtered = filtered.filter((ciudadano) => ciudadano.Circuito.barrio === filtros.barrio);
    }

    setFilteredCiudadanos(filtered);
  };

  const handleLimpiarClick = () => {
    setFiltros({
      provincia: "",
      ciudad: "",
      barrio: "",
    });
    setCiudades([]);
    setBarrios([]);
    setFilteredCiudadanos(ciudadanos);
  };

  const handleEditClick = (ciudadano) => {
    setEditingCiudadano(ciudadano);
  };

  const handleSaveClick = async (ciudadano) => {
    try {
      await axios.put(`http://localhost:3000/api/personas/${ciudadano.id_persona}`, ciudadano);
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
      await axios.delete(`http://localhost:3000/api/personas/${ciudadanoToDelete.id_persona}`);
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
            icon={<FiCheckCircle size={24} />}
            onClick={() => console.log("Botón Ciudadanos presionado")}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select
            name="provincia"
            value={filtros.provincia}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          >
            <option value="">Provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.provincia} value={provincia.provincia}>
                {provincia.provincia}
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
              <option key={ciudad.ciudad} value={ciudad.ciudad}>
                {ciudad.ciudad}
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
            <option value="">Barrio</option>
            {barrios.map((barrio) => (
              <option key={barrio.barrio} value={barrio.barrio}>
                {barrio.barrio}
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-2">Cédula</th>
                <th className="border-b p-2">Nombres</th>
                <th className="border-b p-2">Apellidos</th>
                <th className="border-b p-2">Teléfono</th>
                <th className="border-b p-2">Barrio</th>
                <th className="border-b p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCiudadanos.map((ciudadano) => (
                <tr
                  key={ciudadano.id_persona}
                  className={`border-b ${
                    editingCiudadano?.id_persona === ciudadano.id_persona ? "bg-yellow-100" : ""
                  }`}
                >
                  <td className="border-b p-2">
                    {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                      <input
                        type="text"
                        value={editingCiudadano.cedula}
                        onChange={(e) =>
                          setEditingCiudadano((prevCiudadano) => ({
                            ...prevCiudadano,
                            cedula: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      ciudadano.cedula
                    )}
                  </td>
                  <td className="border-b p-2">
                    {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                      <input
                        type="text"
                        value={editingCiudadano.nombres}
                        onChange={(e) =>
                          setEditingCiudadano((prevCiudadano) => ({
                            ...prevCiudadano,
                            nombres: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
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
                          setEditingCiudadano((prevCiudadano) => ({
                            ...prevCiudadano,
                            apellidos: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      ciudadano.apellidos
                    )}
                  </td>
                  <td className="border-b p-2">
                    {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                      <input
                        type="text"
                        value={editingCiudadano.telefono}
                        onChange={(e) =>
                          setEditingCiudadano((prevCiudadano) => ({
                            ...prevCiudadano,
                            telefono: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      ciudadano.telefono
                    )}
                  </td>
                  <td className="border-b p-2">{ciudadano.Circuito.barrio}</td>
                  <td className="border-b p-2 flex gap-2">
                    {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded"
                          onClick={() => handleSaveClick(editingCiudadano)}
                        >
                          <FiSave size={20} />
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => setEditingCiudadano(null)}
                        >
                          <FiXCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                          onClick={() => handleEditClick(ciudadano)}
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => handleDeleteClick(ciudadano)}
                        >
                          <FiTrash size={20} />
                        </button>
                        <Link
                          to={`/ciudadanos/${ciudadano.id_persona}`}
                          className="bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          <FiEye size={20} />
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">¿Estás seguro de eliminar este ciudadano?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
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

const Button = ({ text, number, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md cursor-pointer"
    >
      <div className="flex items-center">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <p className="text-sm text-gray-600">{text}</p>
          <p className="text-lg font-bold text-gray-900">{number}</p>
        </div>
      </div>bhy
    </div>
  );
};

export default ConsultaCircuito;
