import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiEdit, FiTrash, FiSave, FiEye } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";

const ConsultaCiudadanos = () => {
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
  const [circuitos, setCircuitos] = useState([]);
  const [editingCiudadano, setEditingCiudadano] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ciudadanoToDelete, setCiudadanoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // * CiudadanoRes permite traer los datos de los ciudadanos.
        const ciudadanosRes = await axios.get("http://localhost:3000/personas/ciudadanos");
        // * CircuitoRes permite traer los datos de los circuitos para dar uso de los filtros.
        const circuitosRes = await axios.get("http://localhost:3000/circuitos");

        const uniqueProvincias = [
          ...new Set(circuitosRes.data.map((circuito) => circuito.provincia)),
        ];

        setCiudadanos(ciudadanosRes.data.ciudadanos);
        setFilteredCiudadanos(ciudadanosRes.data.ciudadanos);
        setCircuitos(circuitosRes.data);
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
          circuitos
            .filter((circuito) => circuito.provincia === filtros.provincia)
            .map((circuito) => circuito.ciudad)
        ),
      ];
      setCiudades(uniqueCiudades);
    } else {
      setCiudades([]);
    }

    setFiltros((prevFiltros) => ({ ...prevFiltros, ciudad: "", barrio: "" }));
    setBarrios([]);
  }, [filtros.provincia, circuitos]);

  useEffect(() => {
    if (filtros.ciudad) {
      const uniqueBarrios = [
        ...new Set(
          circuitos
            .filter(
              (circuito) =>
                circuito.provincia === filtros.provincia &&
                circuito.ciudad === filtros.ciudad
            )
            .map((circuito) => circuito.barrio)
        ),
      ];
      setBarrios(uniqueBarrios);
    } else {
      setBarrios([]);
    }

    setFiltros((prevFiltros) => ({ ...prevFiltros, barrio: "" }));
  }, [filtros.ciudad, circuitos]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));
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
    setFilteredCiudadanos(ciudadanos);
    setCiudades([]);
    setBarrios([]);
  };

  const handleEditClick = (ciudadano) => {
    setEditingCiudadano(ciudadano);
  };

  /**
    // * Metodo para la edicion de un ciudadano.
    // * En funcionamiento
   */
  const handleSaveClick = async (ciudadano) => {
    try {
      await axios.put(`http://localhost:3000/personas/${ciudadano.id_persona}`, ciudadano);
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


  
  /**
    // * Metodo para la eliminacion de un ciudadano.
    // * En funcionamiento
   */
  const handleDeleteClick = (ciudadano) => {
    setShowDeleteModal(true);
    setCiudadanoToDelete(ciudadano);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/personas/${ciudadanoToDelete.id_persona}`);
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
            <option value="">Barrio</option>
            {barrios.map((barrio) => (
              <option key={barrio} value={barrio}>
                {barrio}
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
                  <th className="border-b p-2">Teléfono</th>
                  <th className="border-b p-2">Ciudad</th>
                  <th className="border-b p-2">Barrio</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCiudadanos.map((ciudadano) => (
                  <tr key={ciudadano.id_persona} className="hover:bg-gray-50">
                     <td className="border-b p-2 text-center">{ciudadano.id_persona}</td>
                    <td className="border-b p-2 text-center">{ciudadano.cedula}</td>
                    <td className="border-b p-2 ">
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
                      {editingCiudadano?.id_persona === ciudadano.id_persona ? (
                        <input
                          type="text"
                          value={editingCiudadano.telefono}
                          onChange={(e) =>
                            setEditingCiudadano((prev) => ({
                              ...prev,
                              telefono: e.target.value,
                            }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        ciudadano.telefono
                      )}
                    </td>
                    <td className="border-b p-2 text-center">{ciudadano.Circuito.ciudad}</td>
                    <td className="border-b p-2 text-center">{ciudadano.Circuito.barrio}</td>
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
          <p className="text-center mt-4">No existen ciudadanos registrados en dicho barrio</p>
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
