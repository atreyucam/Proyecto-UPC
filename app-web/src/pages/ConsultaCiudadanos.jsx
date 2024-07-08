import React, { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";

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
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [selectedHistorial, setSelectedHistorial] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ciudadanosRes = await axios.get(
          "http://localhost:3000/api/ciudadanos"
        );
        const provinciasRes = await axios.get(
          "http://localhost:3000/api/provincias"
        );

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
    let filtered = ciudadanos;

    if (filtros.provincia) {
      filtered = filtered.filter(
        (citizen) => citizen.Circuito.provincia === filtros.provincia
      );
    }
    if (filtros.ciudad) {
      filtered = filtered.filter(
        (citizen) => citizen.Circuito.ciudad === filtros.ciudad
      );
    }
    if (filtros.barrio) {
      filtered = filtered.filter(
        (citizen) => citizen.Circuito.barrio === filtros.barrio
      );
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

  const handleVerClick = (citizen) => {
    setSelectedCitizen(citizen);
    // Limpia el historial al seleccionar un nuevo ciudadano
    setHistorial([]);
    setSelectedHistorial(null);
    addToHistorial(citizen);
  };

  const addToHistorial = (citizen) => {
    // Simulación de datos de historial, ajustar según datos reales
    const nuevoHistorial = [
      {
        tipo: "Tipo de denuncia 1",
        duracion: "Duración 1",
        estado: "Estado 1",
        descripcion: "Descripción 1",
      },
      {
        tipo: "Tipo de denuncia 2",
        duracion: "Duración 2",
        estado: "Estado 2",
        descripcion: "Descripción 2",
      },
    ];
    setHistorial(nuevoHistorial);
  };

  const handleVerHistorialClick = (item) => {
    setSelectedHistorial(item);
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
              {filteredCiudadanos.map((citizen) => (
                <tr
                  key={citizen.id_persona}
                  className="text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVerClick(citizen)}
                >
                  <td className="border-b p-2">{citizen.cedula}</td>
                  <td className="border-b p-2">{citizen.nombres}</td>
                  <td className="border-b p-2">{citizen.apellidos}</td>
                  <td className="border-b p-2">{citizen.telefono}</td>
                  <td className="border-b p-2">{citizen.Circuito.barrio}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerClick(citizen);
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

        {selectedCitizen && (
          <div >
          <div className="mt-8 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Detalles del Ciudadano</h2>
            <div>
              <div>
                <strong>Nombre:</strong> {selectedCitizen.nombres}
              </div>
              <div>
                <strong>Apellido:</strong> {selectedCitizen.apellidos}
              </div>
              <div>
                <strong>Cédula:</strong> {selectedCitizen.cedula}
              </div>
              <div>
                <strong>Teléfono:</strong> {selectedCitizen.telefono}
              </div>
              <div>
                <strong>Barrio:</strong> {selectedCitizen.Circuito.barrio}
              </div>
              <div>
                <strong>Ciudad:</strong> {selectedCitizen.Circuito.ciudad}
              </div>
              <div>
                <strong>Provincia:</strong> {selectedCitizen.Circuito.provincia}
              </div>
            </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Historial</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border-b p-2">Tipo</th>
                      <th className="border-b p-2">Duración</th>
                      <th className="border-b p-2">Estado</th>
                      <th className="border-b p-2">Descripción</th>
                      <th className="border-b p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="border-b p-2">{item.tipo}</td>
                        <td className="border-b p-2">{item.duracion}</td>
                        <td className="border-b p-2">{item.estado}</td>
                        <td className="border-b p-2">{item.descripcion}</td>
                        <td className="border-b p-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleVerHistorialClick(item)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {selectedHistorial && (
              <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-2">Detalles del Historial</h2>
                <div>
                  <div>
                    <strong>Tipo:</strong> {selectedHistorial.tipo}
                  </div>
                  <div>
                    <strong>Duración:</strong> {selectedHistorial.duracion}
                  </div>
                  <div>
                    <strong>Estado:</strong> {selectedHistorial.estado}
                  </div>
                  <div>
                    <strong>Descripción:</strong> {selectedHistorial.descripcion}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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

export default ConsultaCircuito;
