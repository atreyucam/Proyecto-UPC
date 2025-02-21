import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiShield, FiUsers, FiUserPlus, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const Home3 = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");

  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", cedula: "", telefono: "", email: "",
    password: "", confirmPassword: "", genero: "", idSubzona: "", idCanton: "", idDistrito: ""
  });

  // 🚀 Obtener subzonas
  useEffect(() => {
    axios.get(`${API_URL}/circuitos/subzonas`)
      .then((response) => setSubzonas(response.data))
      .catch((error) => console.error("Error fetching subzonas:", error));
  }, []);

  // 🚀 Obtener cantones cuando cambia la subzona
  useEffect(() => {
    if (formData.idSubzona) {
      axios.get(`${API_URL}/circuitos/subzonas/${formData.idSubzona}/cantones`)
        .then((response) => {
          setCantones(response.data);
          setFormData((prev) => ({ ...prev, idCanton: "", idDistrito: "" }));
        })
        .catch((error) => console.error("Error fetching cantones:", error));
    }
  }, [formData.idSubzona]);

  // 🚀 Obtener distritos cuando cambia el cantón
  useEffect(() => {
    if (formData.idCanton) {
      axios.get(`${API_URL}/circuitos/canton/${formData.idCanton}/distrito`)
        .then((response) => {
          setDistritos(response.data.distritos || []);
          setFormData((prev) => ({ ...prev, idDistrito: "" }));
        })
        .catch((error) => {
          console.error("Error fetching distritos:", error);
          setDistritos([]);
        });
    }
  }, [formData.idCanton]);

  // 🚀 Validación de campos obligatorios
  const validateForm = () => {
    let errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = "Este campo es obligatorio.";
    });

    if (formData.password !== formData.confirmPassword) {
      errors.password = "Las contraseñas no coinciden.";
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🚀 Guardar usuario (Policía o Administrador)
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const url = formType === "policia"
        ? `${API_URL}/personas/nuevoPolicia`
        : `${API_URL}/personas/nuevoAdmin`;

      await axios.post(url, { ...formData, roles: [formType === "policia" ? "Policia" : "Admin"] });

      setSuccessMessage(`${formType === "policia" ? "Policía" : "Administrador"} registrado exitosamente`);
      closeModal();
      setFormData({
        nombres: "", apellidos: "", cedula: "", telefono: "", email: "",
        password: "", confirmPassword: "", genero: "", idSubzona: "", idCanton: "", idDistrito: ""
      });
      setValidationErrors({});
    } catch (error) {
      setErrorMessage("Error al registrar el usuario.");
    }
  };

  // 🚀 Cerrar modal con animación
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Gestión de Usuarios</h2>

      {/* Opciones de Registro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg flex items-center justify-between transition duration-300"
          onClick={() => { setFormType("policia"); setIsModalOpen(true); }}>
          <div className="flex items-center gap-4">
            <FiShield size={30} className="text-blue-600" />
            <h4 className="text-lg font-semibold">Agregar Policía</h4>
          </div>
          <FiUserPlus size={20} className="text-gray-500" />
        </button>

        <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg flex items-center justify-between transition duration-300"
          onClick={() => { setFormType("admin"); setIsModalOpen(true); }}>
          <div className="flex items-center gap-4">
            <FiUsers size={30} className="text-green-600" />
            <h4 className="text-lg font-semibold">Agregar Administrador</h4>
          </div>
          <FiUserPlus size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Modal para agregar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex justify-center items-center z-50" onClick={closeModal}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-4xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Botón de cerrar */}
            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={closeModal}>
              <FiX size={20} />
            </button>

            <h5 className="text-xl font-bold mb-4">Agregar {formType === "policia" ? "Policía" : "Administrador"}</h5>

            <div className="grid grid-cols-2 gap-4">
              {["nombres", "apellidos", "cedula", "telefono", "email", "password", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span></label>
                  <input type={field.includes("password") ? "password" : "text"} name={field} value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}
            </div>

            <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleSave}>Guardar</button>
          </motion.div>
        </div>
      )}

      {successMessage && <div className="bg-green-200 text-green-800 p-4 rounded">{successMessage}</div>}
      {errorMessage && <div className="bg-red-200 text-red-800 p-4 rounded">{errorMessage}</div>}
    </div>
  );
};

export default Home3;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiUserPlus, FiUsers, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const Home3 = () => {
  const [notifications, setNotifications] = useState([]);
  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", cedula: "", telefono: "", email: "",
    password: "", confirmPassword: "", genero: "", idSubzona: "", idCanton: "", idDistrito: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/circuitos/subzonas`)
      .then((response) => setSubzonas(response.data))
      .catch((error) => console.error("Error fetching subzonas:", error));
  }, []);

  useEffect(() => {
    if (formData.idSubzona) {
      axios.get(`${API_URL}/circuitos/subzonas/${formData.idSubzona}/cantones`)
        .then((response) => setCantones(response.data))
        .catch((error) => console.error("Error fetching cantones:", error));
    }
  }, [formData.idSubzona]);

  useEffect(() => {
    if (formData.idCanton) {
      axios.get(`${API_URL}/circuitos/canton/${formData.idCanton}/distrito`)
        .then((response) => setDistritos(response.data.distritos || []))
        .catch((error) => console.error("Error fetching distritos:", error));
    }
  }, [formData.idCanton]);

  const validateForm = async () => {
    let errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = "Este campo es obligatorio.";
    });

    if (formData.password !== formData.confirmPassword) {
      errors.password = "Las contraseñas no coinciden.";
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    try {
      const [cedulaCheck, emailCheck] = await Promise.all([
        axios.get(`${API_URL}/personas/verificarCedula/${formData.cedula}`),
        axios.get(`${API_URL}/personas/verificarEmail/${formData.email}`),
      ]);

      if (!cedulaCheck.data.valido) errors.cedula = "Esta cédula ya está registrada.";
      if (!emailCheck.data.valido) errors.email = "Este correo ya está en uso.";
    } catch (error) {
      console.error("Error en validación de datos únicos:", error);
    }

    setErrors(errors);
    return errors;
  };

  const handleSave = async () => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setNotifications([...notifications, { message: "Corrige los errores antes de continuar.", type: "error" }]);
      return;
    }

    try {
      const url = formType === "policia" 
        ? `${API_URL}/personas/nuevoPolicia` 
        : `${API_URL}/personas/nuevoAdmin`;

      await axios.post(url, { ...formData, roles: [formType === "policia" ? "Policia" : "Admin"] });

      setNotifications([...notifications, { message: "Usuario registrado exitosamente.", type: "success" }]);
      closeModal();
    } catch (error) {
      setNotifications([...notifications, { message: "Error al registrar el usuario.", type: "error" }]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      nombres: "", apellidos: "", cedula: "", telefono: "", email: "",
      password: "", confirmPassword: "", genero: "", idSubzona: "", idCanton: "", idDistrito: ""
    });
    setErrors({});
  };

  return (
    <div className="container mx-auto p-4">
      {notifications.map((notif, index) => (
        <Notification key={index} message={notif.message} type={notif.type} onClose={() => {
          setNotifications(notifications.filter((_, i) => i !== index));
        }} />
      ))}

      <h2 className="text-2xl font-bold mb-6 text-center">Gestión de Usuarios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-300"
          onClick={() => { setFormType("policia"); setIsModalOpen(true); }}>
          <FiShield size={30} className="text-blue-600" />
          <h4 className="text-lg font-semibold">Agregar Policía</h4>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-300"
          onClick={() => { setFormType("admin"); setIsModalOpen(true); }}>
          <FiUsers size={30} className="text-green-600" />
          <h4 className="text-lg font-semibold">Agregar Administrador</h4>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex justify-center items-center z-50" onClick={closeModal}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-4xl relative" onClick={(e) => e.stopPropagation()}>

            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={closeModal}>
              <FiX size={20} />
            </button>

            <h5 className="text-xl font-bold mb-4">Agregar {formType === "policia" ? "Policía" : "Administrador"}</h5>

            <div className="grid grid-cols-2 gap-4">
              {["nombres", "apellidos", "cedula", "telefono", "email", "password", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{field} *</label>
                  <input type="text" name={field} value={formData[field]} onChange={handleChange}
                    className={`w-full border p-2 rounded ${errors[field] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))}

              {["genero", "idSubzona", "idCanton", "idDistrito"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{field} *</label>
                  <select name={field} value={formData[field]} onChange={handleChange}
                    className="w-full border p-2 rounded border-gray-300">
                    <option value="">Seleccione</option>
                  </select>
                </div>
              ))}
            </div>

            <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4 mr-2" onClick={closeModal}>Cancelar</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleSave}>Guardar</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home3;






import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_LOCAL;

const Home3 = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({
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
  });
  const [errors, setErrors] = useState({});
  const [subzonas, setSubzonas] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/circuitos/subzonas`)
      .then(response => {
        console.log("Subzonas cargadas:", response.data);
        setSubzonas(response.data);
      })
      .catch(error => console.error("Error fetching subzonas:", error));
  }, []);

  useEffect(() => {
    if (formData.idSubzona) {
      axios.get(`${API_URL}/circuitos/subzonas/${formData.idSubzona}/cantones`)
        .then(response => {
          console.log("Cantones cargados:", response.data);
          setCantones(response.data);
          setDistritos([]);
        })
        .catch(error => console.error("Error fetching cantones:", error));
    }
  }, [formData.idSubzona]);

  useEffect(() => {
    if (formData.idCanton) {
      axios.get(`${API_URL}/circuitos/canton/${formData.idCanton}/distrito`)
        .then(response => {
          console.log("Distritos cargados:", response.data.distritos);
          setDistritos(response.data.distritos || []);
        })
        .catch(error => console.error("Error fetching distritos:", error));
    }
  }, [formData.idCanton]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Este campo es obligatorio.";
    });
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Las contraseñas no coinciden.";
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="container mx-auto p-4">
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(true)}>
        Agregar Policía
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
            <h5 className="text-xl font-bold mb-4">Agregar Policía</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subzona *</label>
                <select name="idSubzona" value={formData.idSubzona} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="">Seleccione una Subzona</option>
                  {subzonas.map((subzona) => (
                    <option key={subzona.id_subzona} value={subzona.id_subzona}>
                      {subzona.nombre_subzona}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantón *</label>
                <select name="idCanton" value={formData.idCanton} onChange={handleChange} className="w-full border p-2 rounded" disabled={!formData.idSubzona}>
                  <option value="">Seleccione un Cantón</option>
                  {cantones.map((canton) => (
                    <option key={canton.id_canton} value={canton.id_canton}>
                      {canton.nombre_canton}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Distrito *</label>
                <select name="idDistrito" value={formData.idDistrito} onChange={handleChange} className="w-full border p-2 rounded" disabled={!formData.idCanton}>
                  <option value="">Seleccione un Distrito</option>
                  {distritos.map((distrito) => (
                    <option key={distrito.id_distrito} value={distrito.id_distrito}>
                      {distrito.nombre_distrito}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => validateForm()}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home3;
