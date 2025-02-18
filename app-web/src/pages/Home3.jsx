import React, { useState, useEffect } from "react";
import axios from "axios";

const Home3 = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const [policias, setPolicias] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formType, setFormType] = useState(""); 
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "", // Nuevo campo
    genero: "",
    idSubzona: "",
    idCanton: "",
    idDistrito: "",
    roles: "",
  });

  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchSubzonas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/circuitos/subzonas");
        setSubzonas(response.data);
      } catch (error) {
        console.error("Error fetching subzonas:", error);
      }
    };

    fetchSubzonas();
  }, []);

  useEffect(() => {
    if (formData.idSubzona) {
      const fetchCantones = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/circuitos/subzonas/${formData.idSubzona}/cantones`);
          setCantones(response.data);
        } catch (error) {
          console.error("Error fetching cantones:", error);
        }
      };

      fetchCantones();
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        idCanton: "",
        idDistrito: "",
      }));
    }
  }, [formData.idSubzona]);

  useEffect(() => {
    if (formData.idCanton) {
      const fetchDistritos = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/circuitos/canton/${formData.idCanton}/distrito`);
          if (response.data && Array.isArray(response.data.distritos)) {
            setDistritos(response.data.distritos);
          } else {
            setDistritos([]);
          }
        } catch (error) {
          console.error("Error fetching distritos:", error);
          setDistritos([]);
        }
      };

      fetchDistritos();
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        idDistrito: "",
      }));
    }
  }, [formData.idCanton]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddOrEdit = async () => {
    if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
        return;
    }

    const nuevoUsuario = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        cedula: formData.cedula,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
        genero: formData.genero,
        id_subzona: formData.idSubzona,
        id_canton: formData.idCanton,
        id_distrito: formData.idDistrito,
        roles: [formType === "policia" ? "Policia" : "Admin"],
    };

    // Solo agregar campos opcionales si se seleccionan
    if (formType === "policia") {
        if (formData.idParroquia) {
            nuevoUsuario.id_parroquia = formData.idParroquia;
        }
        if (formData.idCircuito) {
            nuevoUsuario.id_circuito = formData.idCircuito;
        }
        if (formData.idSubcircuito) {
            nuevoUsuario.id_subcircuito = formData.idSubcircuito;
        }
    }

    try {
        const url = formType === "policia" 
            ? "http://localhost:3000/personas/nuevoPolicia" 
            : "http://localhost:3000/personas/nuevoAdmin";

        await axios.post(url, nuevoUsuario);

        if (formType === "policia") {
            setPolicias([...policias, nuevoUsuario]);
            setSuccessMessage("Policía registrado satisfactoriamente");
        } else if (formType === "admin") {
            setAdministradores([...administradores, nuevoUsuario]);
            setSuccessMessage("Administrador registrado satisfactoriamente");
        }

        setIsModalOpen(false);
        setFormData({
            nombres: "",
            apellidos: "",
            cedula: "",
            telefono: "",
            email: "",
            password: "",
            confirmPassword: "",
            genero: "",
            idSubzona: "",
            idCanton: "",
            idDistrito: "",
            roles: "",
        });
    } catch (error) {
        setErrorMessage("Error al registrar el usuario. Inténtelo de nuevo.");
        console.error("Error saving usuario:", error);
    }
};


  const handleEdit = (index, type) => {
    const usuario = type === "policia" ? policias[index] : administradores[index];
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      telefono: usuario.telefono,
      email: usuario.email,
      password: usuario.password,
      confirmPassword: usuario.password,
      genero: usuario.genero,
      idSubzona: usuario.idSubzona,
      idCanton: usuario.idCanton,
      idDistrito: usuario.idDistrito,
      roles: usuario.roles,
    });
    setFormType(type);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const Notification = ({ message, type }) => {
    const notificationStyle = type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
  
    return (
      <div className={`p-4 my-4 ${notificationStyle} rounded`}>
        {message}
      </div>
    );
  };
  

  return (
    <div className="container mx-auto p-4">
      {/* Gestión de Policías */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold">Gestión de Policías</h4>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setFormType("policia");
              setIsModalOpen(true);
            }}
          >
            Agregar Policía
          </button>
        </div>
      </div>

      {/* Gestión de Administradores */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold">Gestión de Administradores</h4>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setFormType("admin");
              setIsModalOpen(true);
            }}
          >
            Agregar Administrador
          </button>
        </div>
      </div>

      {/* Modal para agregar/editar usuario (Policía o Administrador) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
            <h5 className="text-xl font-bold mb-4">
              {isEditing
                ? `Editar ${formType === "policia" ? "Policía" : "Administrador"}`
                : `Agregar ${formType === "policia" ? "Policía" : "Administrador"}`}
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirmar Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subzona</label>
                <select
                  name="idSubzona"
                  value={formData.idSubzona}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Seleccione una Subzona</option>
                  {subzonas.map((subzona) => (
                    <option key={subzona.id_subzona} value={subzona.id_subzona}>
                      {subzona.nombre_subzona}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cantón</label>
                <select
                  name="idCanton"
                  value={formData.idCanton}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  disabled={!formData.idSubzona}
                >
                  <option value="">Seleccione un Cantón</option>
                  {cantones.map((canton) => (
                    <option key={canton.id_canton} value={canton.id_canton}>
                      {canton.nombre_canton}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Distrito</label>
                <select
                  name="idDistrito"
                  value={formData.idDistrito}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  disabled={!formData.idCanton}
                >
                  <option value="">Seleccione un Distrito</option>
                  {distritos.map((distrito) => (
                    <option key={distrito.id_distrito} value={distrito.id_distrito}>
                      {distrito.nombre_distrito}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddOrEdit}
              >
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

{successMessage && (
    <Notification message={successMessage} type="success" />
)}
{errorMessage && (
    <Notification message={errorMessage} type="error" />
)}

    </div>
  );
};

export default Home3;
