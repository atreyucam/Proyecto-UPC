import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  XCircleIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL_LOCAL;

const RegistroPolicia = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    idSubzona: "",
    idCanton: "",
    idDistrito: "",
  });

  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [cedulaValida, setCedulaValida] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const fetchSubzonas = async () => {
      try {
        const response = await axios.get(`${API_URL}/circuitos/subzonas`);
        setSubzonas(response.data);
      } catch (error) {
        console.error("Error obteniendo subzonas:", error);
      }
    };
    fetchSubzonas();
  }, []);

  useEffect(() => {
    if (formData.idSubzona) {
      const fetchCantones = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/circuitos/subzonas/${formData.idSubzona}/cantones`
          );
          setCantones(response.data);
        } catch (error) {
          console.error("Error obteniendo cantones:", error);
        }
      };
      fetchCantones();
    }
  }, [formData.idSubzona]);

  useEffect(() => {
    if (formData.idCanton) {
      const fetchDistritos = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/circuitos/canton/${formData.idCanton}/distrito`
          );
          setDistritos(response.data.distritos || []);
        } catch (error) {
          console.error("Error obteniendo distritos:", error);
        }
      };
      fetchDistritos();
    }
  }, [formData.idCanton]);

  const handleVerificarCedula = async () => {
    setVerificando(true);
    setMensajeError("");

    try {
      const response = await axios.get(
        `${API_URL}/persona/verificarCedula/${formData.cedula}`
      );
      const data = response.data;

      setFormData((prev) => ({
        ...prev,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_nacimiento: data.fecha_nacimiento,
        genero: data.genero,
      }));
      setCedulaValida(true);
    } catch (error) {
      setMensajeError("No se encontró información para esta cédula.");
      setCedulaValida(false);
    } finally {
      setVerificando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    const nuevoPolicia = {
      cedula: formData.cedula,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      id_canton: Number(formData.idCanton),
      id_subzona: Number(formData.idSubzona),
      id_parroquia: Number(formData.idDistrito) || null,
    };

    try {
      await axios.post(`${API_URL}/persona/nuevoPolicia`, nuevoPolicia);
      alert("Policía registrado exitosamente.");
      setModalAbierto(false);
      setFormData({
        cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        genero: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
        idSubzona: "",
        idCanton: "",
        idDistrito: "",
      });
      setCedulaValida(false);
    } catch (error) {
      console.error("❌ Error en el registro:", error.response?.data || error.message);
      setMensajeError(error.response?.data?.message || "Error desconocido al registrar.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Tarjeta para abrir el formulario */}
      <div
        className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
        onClick={() => setModalAbierto(true)}
      >
        <ShieldCheckIcon className="h-12 w-12 text-blue-500" />
        <p className="mt-2 text-lg font-semibold">Agregar Policía</p>
      </div>

      {/* Modal del formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl relative">
            {/* Botón de Cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setModalAbierto(false)}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500" /> Registro de Policía
            </h2>

            {cedulaValida && (
              <div className="bg-green-100 text-green-700 p-2 rounded-md mb-4">
                ✅ Cédula verificada correctamente.
              </div>
            )}

            {mensajeError && (
              <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
                ❌ {mensajeError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="cedula" placeholder="Cédula" className="border p-2 rounded-md" value={formData.cedula} onChange={handleChange} />
              <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600" onClick={handleVerificarCedula} disabled={verificando}>
                {verificando ? "Verificando..." : "Verificar"}
              </button>

              <input type="text" value={formData.nombres} className="border p-2 rounded-md bg-gray-100" disabled />
              <input type="text" value={formData.apellidos} className="border p-2 rounded-md bg-gray-100" disabled />

              <input 
  type="text" 
  value={formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toLocaleDateString() : ""} 
  className="border p-2 rounded-md bg-gray-100" 
  disabled 
/>


<input 
  type="text" 
  value={formData.genero} 
  className="border p-2 rounded-md bg-gray-100" 
  disabled 
/>

              <input type="email" name="email" placeholder="Email" className="border p-2 rounded-md" value={formData.email} onChange={handleChange} />
              <input type="text" name="telefono" placeholder="Teléfono" className="border p-2 rounded-md" value={formData.telefono} onChange={handleChange} />

              <input type="password" name="password" placeholder="Contraseña" className="border p-2 rounded-md" value={formData.password} onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" className="border p-2 rounded-md" value={formData.confirmPassword} onChange={handleChange} />
            </div>
            {/* Selección de Subzona, Cantón y Distrito */}
            <div className="grid grid-cols-3 gap-6 mt-4">

              <select name="idSubzona" value={formData.idSubzona} onChange={handleChange} className="border p-2 rounded-md">
                <option value="">Seleccione Subzona</option>
                {subzonas.map((s) => <option key={s.id_subzona} value={s.id_subzona}>{s.nombre_subzona}</option>)}
              </select>

              <select name="idCanton" value={formData.idCanton} onChange={handleChange} className="border p-2 rounded-md" disabled={!formData.idSubzona}>
                <option value="">Seleccione Cantón</option>
                {cantones.map((c) => <option key={c.id_canton} value={c.id_canton}>{c.nombre_canton}</option>)}
              </select>

              <select name="idDistrito" value={formData.idDistrito} onChange={handleChange} className="border p-2 rounded-md" disabled={!formData.idCanton}>
                <option value="">Seleccione Distrito</option>
                {distritos.map((d) => <option key={d.id_distrito} value={d.id_distrito}>{d.nombre_distrito}</option>)}
              </select>
            </div>

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600" onClick={() => setModalAbierto(false)}>
                Cancelar
              </button>
              <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600" onClick={handleSubmit}>
                Registrar Policía
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroPolicia;
