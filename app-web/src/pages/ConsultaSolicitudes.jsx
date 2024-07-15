import React, { useState, useEffect } from "react";
import axios from "axios";

const ConsultaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    subtipo: "",
    estado: "",
    provincia: "",
    ciudad: "",
    barrio: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [tipos, setTipos] = useState([]);
  const [subtipos, setSubtipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);

  const recordsPerPage = 10; // Número de registros por página
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const solicitudesRes = await axios.get(
          "http://localhost:3000/api/solicitudes"
        );
        const tiposRes = await axios.get(
          "http://localhost:3000/api/tipoSolicitud"
        );
        const estadosRes = await axios.get(
          "http://localhost:3000/api/estadoSolicitudes"
        );
        const provinciasRes = await axios.get(
          "http://localhost:3000/api/provincias"
        );

        setSolicitudes(solicitudesRes.data);
        setFilteredSolicitudes(solicitudesRes.data);
        setTipos(tiposRes.data);
        setEstados(estadosRes.data);
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

    if (name === "tipo") {
      try {
        const subtiposRes = await axios.get(
          `http://localhost:3000/api/tipos/${value}/subtipos`
        );
        setSubtipos(subtiposRes.data);
        setFiltros((prevFiltros) => ({ ...prevFiltros, subtipo: "" }));
      } catch (error) {
        console.error("Error fetching subtipos", error);
      }
    }

    if (name === "provincia") {
      try {
        const ciudadesRes = await axios.get(
          `http://localhost:3000/api/ciudades/${value}`
        );
        setCiudades(ciudadesRes.data);
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          ciudad: "",
          barrio: "",
        }));
        setBarrios([]);
      } catch (error) {
        console.error("Error fetching ciudades", error);
      }
    }

    if (name === "ciudad") {
      try {
        const barriosRes = await axios.get(
          `http://localhost:3000/api/barrios/${filtros.provincia}/${value}`
        );
        setBarrios(barriosRes.data);
        setFiltros((prevFiltros) => ({ ...prevFiltros, barrio: "" }));
      } catch (error) {
        console.error("Error fetching barrios", error);
      }
    }
  };

  const handleBuscarClick = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/filtrosSolicitudes",
        {
          params: filtros,
        }
      );
      setFilteredSolicitudes(response.data);
      setCurrentPage(1); // Reinicia a la primera página cuando se hace una nueva búsqueda
    } catch (error) {
      console.error("Error fetching filtered data", error);
    }
  };

  const handleLimpiarFiltroClick = () => {
    setFiltros({
      tipo: "",
      subtipo: "",
      estado: "",
      provincia: "",
      ciudad: "",
      barrio: "",
      fechaInicio: "",
      fechaFin: "",
    });
    setSubtipos([]);
    setCiudades([]);
    setBarrios([]);
    setFilteredSolicitudes(solicitudes);
    setCurrentPage(1); // Reinicia a la primera página cuando se limpian los filtros
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSolicitudes.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              <option key={tipo.id_tipo} value={tipo.id_tipo}>
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
              <option key={subtipo.id_subtipo} value={subtipo.id_subtipo}>
                {subtipo.descripcion}
              </option>
            ))}
          </select>
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          >
            <option value="">Estado</option>
            {estados.map((estado) => (
              <option key={estado.id_estado} value={estado.id_estado}>
                {estado.descripcion}
              </option>
            ))}
          </select>
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
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
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
                <th className="border-b p-2">Provincia</th>
                <th className="border-b p-2">Ciudad</th>
                <th className="border-b p-2">Barrio</th>
                <th className="border-b p-2">Policía Asignado</th>
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
                  <td className="border-b p-2">
                    {solicitud.Circuito.provincia}
                  </td>
                  <td className="border-b p-2">{solicitud.Circuito.ciudad}</td>
                  <td className="border-b p-2">{solicitud.Circuito.barrio}</td>
                  <td className="border-b p-2">
                    {solicitud.SolicitudEventoPersonas &&
                    solicitud.SolicitudEventoPersonas.some(
                      (evento) => evento.Persona
                    )
                      ? solicitud.SolicitudEventoPersonas.map((evento) =>
                          evento.Persona
                            ? `${evento.Persona.nombres} ${evento.Persona.apellidos}`
                            : null
                        )
                          .filter(Boolean)
                          .join(", ")
                      : "Por asignar"}
                  </td>
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

export default ConsultaSolicitudes;
