import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiEdit, FiTrash, FiSave, FiX, FiEye } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConsultaPolicia = () => {
  const [policias, setPolicias] = useState([]);
  const [filteredPolicias, setFilteredPolicias] = useState([]);
  const [filtros, setFiltros] = useState({
    provincia: "",
    ciudad: "",
    barrio: "",
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [editingPoliceId, setEditingPoliceId] = useState(null);
  const [editedPolice, setEditedPolice] = useState({});
  const [deletePoliceId, setDeletePoliceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policiasRes = await axios.get("http://localhost:3000/api/policias");
        const provinciasRes = await axios.get("http://localhost:3000/api/provincias");

        setPolicias(policiasRes.data);
        setFilteredPolicias(policiasRes.data);
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
      const ciudadesRes = await axios.get(
        `http://localhost:3000/api/ciudades/${value}`
      );
      setCiudades(ciudadesRes.data);
      setBarrios([]);
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ciudad: "",
        barrio: "",
      }));
    } else if (name === "ciudad") {
      const barriosRes = await axios.get(
        `http://localhost:3000/api/barrios/${filtros.provincia}/${value}`
      );
      setBarrios(barriosRes.data);
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        barrio: "",
      }));
    }
  };

  const handleBuscarClick = () => {
    let filtered = policias;

    if (filtros.provincia) {
      filtered = filtered.filter(
        (police) => police.Circuito.provincia === filtros.provincia
      );
    }
    if (filtros.ciudad) {
      filtered = filtered.filter(
        (police) => police.Circuito.ciudad === filtros.ciudad
      );
    }
    if (filtros.barrio) {
      filtered = filtered.filter(
        (police) => police.Circuito.barrio === filtros.barrio
      );
    }

    setFilteredPolicias(filtered);
  };

  const handleLimpiarFiltroClick = () => {
    setFiltros({
      provincia: "",
      ciudad: "",
      barrio: "",
    });
    setCiudades([]);
    setBarrios([]);
    setFilteredPolicias(policias);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPolicias.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleEditClick = (police) => {
    setEditingPoliceId(police.id_persona);
    setEditedPolice(police);
  };

  const handleDeleteClick = (id) => {
    setDeletePoliceId(id);
    setShowDeleteModal(true);
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/personas/${id}`, editedPolice);
      setPolicias((prev) =>
        prev.map((police) =>
          police.id_persona === id ? { ...police, ...editedPolice } : police
        )
      );
      setFilteredPolicias((prev) =>
        prev.map((police) =>
          police.id_persona === id ? { ...police, ...editedPolice } : police
        )
      );
      setEditingPoliceId(null);
      setEditedPolice({});
    } catch (error) {
      console.error("Error updating police", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/personas/${deletePoliceId}`);
      setPolicias((prev) =>
        prev.filter((police) => police.id_persona !== deletePoliceId)
      );
      setFilteredPolicias((prev) =>
        prev.filter((police) => police.id_persona !== deletePoliceId)
      );
      setShowDeleteModal(false);
      setDeletePoliceId(null);
    } catch (error) {
      console.error("Error deleting police", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePoliceId(null);
  };

  const handleRowClick = (police) => {
    navigate(`/policias/${police.id_persona}`);
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de policías</h1>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-100 rounded-lg">
          <Button
            text="Policías registrados"
            number={filteredPolicias.length}
            icon={<FiCheckCircle size={24} />}
            onClick={() => console.log("Botón Policías presionado")}
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
              onClick={handleLimpiarFiltroClick}
            >
              Limpiar Filtro
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">Policías</h2>
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
              {currentRecords.map((police) => (
                <tr key={police.id_persona}>
                  {editingPoliceId === police.id_persona ? (
                    <>
                      <td className="border-b p-2">
                        <input
                          type="text"
                          value={editedPolice.cedula}
                          onChange={(e) =>
                            setEditedPolice({
                              ...editedPolice,
                              cedula: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="text"
                          value={editedPolice.nombres}
                          onChange={(e) =>
                            setEditedPolice({
                              ...editedPolice,
                              nombres: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="text"
                          value={editedPolice.apellidos}
                          onChange={(e) =>
                            setEditedPolice({
                              ...editedPolice,
                              apellidos: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="text"
                          value={editedPolice.telefono}
                          onChange={(e) =>
                            setEditedPolice({
                              ...editedPolice,
                              telefono: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="text"
                          value={editedPolice.Circuito.barrio}
                          onChange={(e) =>
                            setEditedPolice({
                              ...editedPolice,
                              Circuito: {
                                ...editedPolice.Circuito,
                                barrio: e.target.value,
                              },
                            })
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td className="border-b p-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => handleSaveClick(police.id_persona)}
                        >
                          <FiSave size={20} />
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                          onClick={() => setEditingPoliceId(null)}
                        >
                          <FiX size={20} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-b p-2">{police.cedula}</td>
                      <td className="border-b p-2">{police.nombres}</td>
                      <td className="border-b p-2">{police.apellidos}</td>
                      <td className="border-b p-2">{police.telefono}</td>
                      <td className="border-b p-2">{police.Circuito.barrio}</td>
                      <td className="border-b p-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => handleEditClick(police)}
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                          onClick={() => handleDeleteClick(police.id_persona)}
                        >
                          <FiTrash size={20} />
                        </button>
                        <button
                          className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
                          onClick={() => handleRowClick(police)}
                        >
                          <FiEye size={20} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredPolicias.length / recordsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              ¿Está seguro de que desea eliminar este policía?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCancelDelete}
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
        {icon}
        <span className="ml-2 text-lg font-semibold">{text}</span>
      </div>
      <span className="text-lg font-semibold">{number}</span>
    </div>
  );
};

export default ConsultaPolicia;
