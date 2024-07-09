import React, { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [historial, setHistorial] = useState([]);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const navigate = useNavigate();

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
        (ciudadan) => ciudadan.Circuito.provincia === filtros.provincia
      );
    }
    if (filtros.ciudad) {
      filtered = filtered.filter(
        (ciudadan) => ciudadan.Circuito.ciudad === filtros.ciudad
      );
    }
    if (filtros.barrio) {
      filtered = filtered.filter(
        (ciudadan) => ciudadan.Circuito.barrio === filtros.barrio
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

  
  const handleRowClick = (ciudadan) => {
    navigate(`/ciudadanos/${ciudadan.id_persona}`);
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
              {filteredCiudadanos.map((ciudadan) => (
                <tr
                  key={ciudadan.id_persona}
                  className="text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleRowClick(ciudadan)}
                >
                  <td className="border-b p-2">{ciudadan.cedula}</td>
                  <td className="border-b p-2">{ciudadan.nombres}</td>
                  <td className="border-b p-2">{ciudadan.apellidos}</td>
                  <td className="border-b p-2">{ciudadan.telefono}</td>
                  <td className="border-b p-2">{ciudadan.Circuito.barrio}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(ciudadan);
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
      </div>
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
      </div>
    </div>
  );
};

export default ConsultaCircuito;
