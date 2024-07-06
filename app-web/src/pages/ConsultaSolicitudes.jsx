import React, { useState, useEffect } from "react";
import axios from "axios";

const ConsultaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    subtipo: "",
  });
  const [tipos, setTipos] = useState([]);
  const [subtipos, setSubtipos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const solicitudesRes = await axios.get(
          "http://localhost:3000/api/solicitudes"
        );
        const tiposRes = await axios.get(
          "http://localhost:3000/api/tipoSolicitud"
        ); // Asegúrate de tener esta API
        setSolicitudes(solicitudesRes.data);
        setFilteredSolicitudes(solicitudesRes.data);
        setTipos(tiposRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleFiltroChange = async (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));

    if (name === "tipo") {
      const subtiposRes = await axios.get(
        `http://localhost:3000/api/subtipo/${value}`
      );
      setSubtipos(subtiposRes.data);
      setFiltros((prevFiltros) => ({ ...prevFiltros, subtipo: "" }));
    }
  };

  const handleBuscarClick = () => {
    let filtered = solicitudes;

    if (filtros.tipo) {
      filtered = filtered.filter(
        (solicitud) =>
          solicitud.Subtipo.TipoSolicitud.descripcion === filtros.tipo
      );
    }
    if (filtros.subtipo) {
      filtered = filtered.filter(
        (solicitud) => solicitud.Subtipo.descripcion === filtros.subtipo
      );
    }

    setFilteredSolicitudes(filtered);
  };

  const handleLimpiarFiltroClick = () => {
    setFiltros({
      tipo: "",
      subtipo: "",
    });
    setTipos([]);
    setSubtipos([]);
    setFilteredSolicitudes(solicitudes);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSolicitudes.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Solicitudes</h1>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select
            name="tipo"
            value={filtros.tipo}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          >
            <option value="">Tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.id_tipo} value={tipo.descripcion}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
          <select
            name="subtipo"
            value={filtros.subtipo}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
            disabled={!filtros.tipo}
          >
            <option value="">Subtipo</option>
            {subtipos.map((subtipo) => (
              <option key={subtipo.id_subtipo} value={subtipo.descripcion}>
                {subtipo.descripcion}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleBuscarClick}
          >
            Buscar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handleLimpiarFiltroClick}
          >
            Limpiar Filtro
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4">Solicitudes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-2">ID Solicitud</th>
                <th className="border-b p-2">Estado</th>
                <th className="border-b p-2">Tipo</th>
                <th className="border-b p-2">Subtipo</th>
                <th className="border-b p-2">Fecha de Creación</th>
                <th className="border-b p-2">PuntoGPS</th>
                <th className="border-b p-2">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((solicitud) => (
                <tr key={solicitud.id_solicitud} className="text-center">
                  <td className="border-b p-2">{solicitud.id_solicitud}</td>
                  <td className="border-b p-2">
                    {solicitud.Estado.descripcion}
                  </td>
                  <td className="border-b p-2">
                    {solicitud.Subtipo.TipoSolicitud.descripcion}
                  </td>
                  <td className="border-b p-2">
                    {solicitud.Subtipo.descripcion}
                  </td>
                  <td className="border-b p-2">
                    {new Date(solicitud.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="border-b p-2">{solicitud.puntoGPS}</td>
                  <td className="border-b p-2">{solicitud.direccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredSolicitudes.length / recordsPerPage) },
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
    </div>
  );
};

const Button = ({ text, number, onClick, icon }) => {
  return (
    <button
      className="flex items-center justify-between bg-white text-gray-800 p-4 rounded-lg shadow-md hover:bg-black hover:text-white transition duration-300 w-full"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div>{icon}</div>
        <div>
          <span className="block text-lg font-bold">{text}</span>
          {number !== null && (
            <span className="block text-lg font-bold">{number}</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConsultaSolicitudes;
