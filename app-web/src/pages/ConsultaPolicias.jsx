import React, { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
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
  const [selectedPolice, setSelectedPolice] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policiasRes = await axios.get(
          "http://localhost:3000/api/policias"
        );
        const provinciasRes = await axios.get(
          "http://localhost:3000/api/provincias"
        );

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
  const currentRecords = filteredPolicias.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleRowClick = (police) => {
    setSelectedPolice(police);
    // Limpia el historial al seleccionar un nuevo policía
    setHistorial([]);
    addToHistorial(police);
  };

  const addToHistorial = (police) => {
    setHistorial([
      {
        nombre: `${police.nombres} ${police.apellidos}`,
        tipo: "Tipo de denuncia", // Ajustar según los datos reales
        duracion: "Duración", // Ajustar según los datos reales
        estado: "Estado", // Ajustar según los datos reales
        descripcion: "Descripción", // Ajustar según los datos reales
      },
    ]);
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
                <tr
                  key={police.id_persona}
                  className="text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleRowClick(police)}
                >
                  <td className="border-b p-2">{police.cedula}</td>
                  <td className="border-b p-2">{police.nombres}</td>
                  <td className="border-b p-2">{police.apellidos}</td>
                  <td className="border-b p-2">{police.telefono}</td>
                  <td className="border-b p-2">{police.Circuito.barrio}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(police);
                      }}
                    >
                      Ver
                    </button>
                  </td>
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

      {selectedPolice && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Detalles del Policía</h2>
                <div className="mb-2">
                  <strong>Nombre:</strong>{" "}
                  {`${selectedPolice.nombres} ${selectedPolice.apellidos}`}
                </div>
                <div className="mb-2">
                  <strong>Teléfono:</strong> {selectedPolice.telefono}
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <strong>Cédula:</strong> {selectedPolice.cedula}
                </div>
                <div className="mb-2">
                  <strong>Barrio:</strong> {selectedPolice.Circuito.barrio}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 mt-4">Historial</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b p-2">Nombre</th>
                    <th className="border-b p-2">Tipo de denuncia</th>
                    <th className="border-b p-2">Duración</th>
                    <th className="border-b p-2">Estado</th>
                    <th className="border-b p-2">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((entry, index) => (
                    <tr key={index} className="text-center">
                      <td className="border-b p-2">{entry.nombre}</td>
                      <td className="border-b p-2">{entry.tipo}</td>
                      <td className="border-b p-2">{entry.duracion}</td>
                      <td className="border-b p-2">{entry.estado}</td>
                      <td className="border-b p-2">{entry.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded self-start"
              onClick={() => setSelectedPolice(null)}
            >
              Cerrar
            </button>
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
