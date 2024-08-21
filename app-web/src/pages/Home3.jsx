// import React, { useState } from 'react';
// import Layout from './components/Layout';

// const Home3 = () => {
//   // Estado para gestionar circuitos
//   const [solicitudes, setSolicitudes] = useState([]);
//   const [isCircuitoModalOpen, setIsCircuitoModalOpen] = useState(false);
//   const [nombreCircuito, setNombreCircuito] = useState('');
//   const [provinciaCircuito, setProvinciaCircuito] = useState('');
//   const [ciudadCircuito, setCiudadCircuito] = useState('');
//   const [barrioCircuito, setBarrioCircuito] = useState('');
//   const [numeroCircuito, setNumeroCircuito] = useState('');
//   const [editingIndex, setEditingIndex] = useState(null);

//   // Estado para gestionar administradores
//   const [administradores, setAdministradores] = useState([]);
//   const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
//   const [nombreAdmin, setNombreAdmin] = useState('');
//   const [apellidoAdmin, setApellidoAdmin] = useState('');
//   const [cedulaAdmin, setCedulaAdmin] = useState('');
//   const [rangoAdmin, setRangoAdmin] = useState('');
//   const [direccionAdmin, setDireccionAdmin] = useState('');
//   const [telefonoAdmin, setTelefonoAdmin] = useState('');
//   const [editingAdminIndex, setEditingAdminIndex] = useState(null);

//   // Estado para gestionar policías
//   const [policias, setPolicias] = useState([]);
//   const [isPoliciaModalOpen, setIsPoliciaModalOpen] = useState(false);
//   const [nombresPolicia, setNombresPolicia] = useState('');
//   const [apellidosPolicia, setApellidosPolicia] = useState('');
//   const [cedulaPolicia, setCedulaPolicia] = useState('');
//   const [telefonoPolicia, setTelefonoPolicia] = useState('');
//   const [emailPolicia, setEmailPolicia] = useState('');
//   const [passwordPolicia, setPasswordPolicia] = useState('');
//   const [generoPolicia, setGeneroPolicia] = useState('');
//   const [editingPoliciaIndex, setEditingPoliciaIndex] = useState(null);

//   // Funciones para gestionar circuitos
//   const handleAddOrEditCircuito = () => {
//     const nuevoCircuito = { nombre: nombreCircuito, provincia: provinciaCircuito, ciudad: ciudadCircuito, barrio: barrioCircuito, numeroCircuito };
//     if (editingIndex !== null) {
//       const circuitosActualizados = [...solicitudes];
//       circuitosActualizados[editingIndex] = nuevoCircuito;
//       setSolicitudes(circuitosActualizados);
//     } else {
//       setSolicitudes([...solicitudes, nuevoCircuito]);
//     }
//     setIsCircuitoModalOpen(false);
//     setNombreCircuito('');
//     setProvinciaCircuito('');
//     setCiudadCircuito('');
//     setBarrioCircuito('');
//     setNumeroCircuito('');
//     setEditingIndex(null);
//   };

//   const handleEditCircuito = (index) => {
//     const circuito = solicitudes[index];
//     setNombreCircuito(circuito.nombre);
//     setProvinciaCircuito(circuito.provincia);
//     setCiudadCircuito(circuito.ciudad);
//     setBarrioCircuito(circuito.barrio);
//     setNumeroCircuito(circuito.numeroCircuito);
//     setEditingIndex(index);
//     setIsCircuitoModalOpen(true);
//   };

//   const handleDeleteCircuito = (index) => {
//     const circuitosActualizados = [...solicitudes];
//     circuitosActualizados.splice(index, 1);
//     setSolicitudes(circuitosActualizados);
//   };

//   // Funciones para gestionar administradores
//   const handleAddOrEditAdmin = () => {
//     const nuevoAdmin = { nombre: nombreAdmin, apellido: apellidoAdmin, cedula: cedulaAdmin, rango: rangoAdmin, direccion: direccionAdmin, telefono: telefonoAdmin };
//     if (editingAdminIndex !== null) {
//       const adminsActualizados = [...administradores];
//       adminsActualizados[editingAdminIndex] = nuevoAdmin;
//       setAdministradores(adminsActualizados);
//     } else {
//       setAdministradores([...administradores, nuevoAdmin]);
//     }
//     setIsAdminModalOpen(false);
//     setNombreAdmin('');
//     setApellidoAdmin('');
//     setCedulaAdmin('');
//     setRangoAdmin('');
//     setDireccionAdmin('');
//     setTelefonoAdmin('');
//     setEditingAdminIndex(null);
//   };

//   const handleEditAdmin = (index) => {
//     const admin = administradores[index];
//     setNombreAdmin(admin.nombre);
//     setApellidoAdmin(admin.apellido);
//     setCedulaAdmin(admin.cedula);
//     setRangoAdmin(admin.rango);
//     setDireccionAdmin(admin.direccion);
//     setTelefonoAdmin(admin.telefono);
//     setEditingAdminIndex(index);
//     setIsAdminModalOpen(true);
//   };

//   const handleDeleteAdmin = (index) => {
//     const adminsActualizados = [...administradores];
//     adminsActualizados.splice(index, 1);
//     setAdministradores(adminsActualizados);
//   };

//   // Funciones para gestionar policías
//   const handleAddOrEditPolicia = () => {
//     const nuevoPolicia = { nombres: nombresPolicia, apellidos: apellidosPolicia, cedula: cedulaPolicia, telefono: telefonoPolicia, email: emailPolicia, password: passwordPolicia, genero: generoPolicia };
//     if (editingPoliciaIndex !== null) {
//       const policiasActualizados = [...policias];
//       policiasActualizados[editingPoliciaIndex] = nuevoPolicia;
//       setPolicias(policiasActualizados);
//     } else {
//       setPolicias([...policias, nuevoPolicia]);
//     }
//     setIsPoliciaModalOpen(false);
//     setNombresPolicia('');
//     setApellidosPolicia('');
//     setCedulaPolicia('');
//     setTelefonoPolicia('');
//     setEmailPolicia('');
//     setPasswordPolicia('');
//     setGeneroPolicia('');
//     setEditingPoliciaIndex(null);
//   };

//   const handleEditPolicia = (index) => {
//     const policia = policias[index];
//     setNombresPolicia(policia.nombres);
//     setApellidosPolicia(policia.apellidos);
//     setCedulaPolicia(policia.cedula);
//     setTelefonoPolicia(policia.telefono);
//     setEmailPolicia(policia.email);
//     setPasswordPolicia(policia.password);
//     setGeneroPolicia(policia.genero);
//     setEditingPoliciaIndex(index);
//     setIsPoliciaModalOpen(true);
//   };

//   const handleDeletePolicia = (index) => {
//     const policiasActualizados = [...policias];
//     policiasActualizados.splice(index, 1);
//     setPolicias(policiasActualizados);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Sección de Gestión de Circuitos */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h4 className="text-2xl font-bold">Gestión de Circuitos</h4>
//           <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsCircuitoModalOpen(true)}>
//             Agregar
//           </button>
//         </div>
//         <div className="grid gap-4">
//           {solicitudes.map((circuito, index) => (
//             <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
//               <div>
//                 <h6 className="text-lg font-bold">{circuito.nombre}</h6>
//                 <p>{circuito.provincia}, {circuito.ciudad}, {circuito.barrio}</p>
//                 <p>Número de Circuito: {circuito.numeroCircuito}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditCircuito(index)}>
//                   Editar
//                 </button>
//                 <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteCircuito(index)}>
//                   Eliminar
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Modal para agregar/editar circuito */}
//         {isCircuitoModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <h5 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Editar Circuito' : 'Agregar Circuito'}</h5>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Nombre</label>
//                 <input
//                   type="text"
//                   value={nombreCircuito}
//                   onChange={(e) => setNombreCircuito(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Provincia</label>
//                 <input
//                   type="text"
//                   value={provinciaCircuito}
//                   onChange={(e) => setProvinciaCircuito(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Ciudad</label>
//                 <input
//                   type="text"
//                   value={ciudadCircuito}
//                   onChange={(e) => setCiudadCircuito(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Barrio</label>
//                 <input
//                   type="text"
//                   value={barrioCircuito}
//                   onChange={(e) => setBarrioCircuito(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Número de Circuito</label>
//                 <input
//                   type="text"
//                   value={numeroCircuito}
//                   onChange={(e) => setNumeroCircuito(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsCircuitoModalOpen(false)}>
//                   Cancelar
//                 </button>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditCircuito}>
//                   {editingIndex !== null ? 'Actualizar' : 'Agregar'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Sección de Gestión de Administradores */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h4 className="text-2xl font-bold">Gestión de Administradores</h4>
//           <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsAdminModalOpen(true)}>
//             Agregar
//           </button>
//         </div>
//         <div className="grid gap-4">
//           {administradores.map((admin, index) => (
//             <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
//               <div>
//                 <h6 className="text-lg font-bold">{admin.nombre} {admin.apellido}</h6>
//                 <p>Cédula: {admin.cedula}</p>
//                 <p>Rango: {admin.rango}</p>
//                 <p>Dirección: {admin.direccion}</p>
//                 <p>Teléfono: {admin.telefono}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditAdmin(index)}>
//                   Editar
//                 </button>
//                 <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteAdmin(index)}>
//                   Eliminar
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Modal para agregar/editar administrador */}
//         {isAdminModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <h5 className="text-xl font-bold mb-4">{editingAdminIndex !== null ? 'Editar Administrador' : 'Agregar Administrador'}</h5>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Nombre</label>
//                 <input
//                   type="text"
//                   value={nombreAdmin}
//                   onChange={(e) => setNombreAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Apellido</label>
//                 <input
//                   type="text"
//                   value={apellidoAdmin}
//                   onChange={(e) => setApellidoAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Cédula</label>
//                 <input
//                   type="text"
//                   value={cedulaAdmin}
//                   onChange={(e) => setCedulaAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Rango</label>
//                 <input
//                   type="text"
//                   value={rangoAdmin}
//                   onChange={(e) => setRangoAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Dirección</label>
//                 <input
//                   type="text"
//                   value={direccionAdmin}
//                   onChange={(e) => setDireccionAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Teléfono</label>
//                 <input
//                   type="text"
//                   value={telefonoAdmin}
//                   onChange={(e) => setTelefonoAdmin(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsAdminModalOpen(false)}>
//                   Cancelar
//                 </button>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditAdmin}>
//                   {editingAdminIndex !== null ? 'Actualizar' : 'Agregar'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Sección de Gestión de Policías */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h4 className="text-2xl font-bold">Gestión de Policías</h4>
//           <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsPoliciaModalOpen(true)}>
//             Agregar
//           </button>
//         </div>
//         <div className="grid gap-4">
//           {policias.map((policia, index) => (
//             <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
//               <div>
//                 <h6 className="text-lg font-bold">{policia.nombres} {policia.apellidos}</h6>
//                 <p>Cédula: {policia.cedula}</p>
//                 <p>Teléfono: {policia.telefono}</p>
//                 <p>Email: {policia.email}</p>
//                 <p>Género: {policia.genero}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditPolicia(index)}>
//                   Editar
//                 </button>
//                 <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeletePolicia(index)}>
//                   Eliminar
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Modal para agregar/editar policía */}
//         {isPoliciaModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <h5 className="text-xl font-bold mb-4">{editingPoliciaIndex !== null ? 'Editar Policía' : 'Agregar Policía'}</h5>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Nombres</label>
//                 <input
//                   type="text"
//                   value={nombresPolicia}
//                   onChange={(e) => setNombresPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Apellidos</label>
//                 <input
//                   type="text"
//                   value={apellidosPolicia}
//                   onChange={(e) => setApellidosPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Cédula</label>
//                 <input
//                   type="text"
//                   value={cedulaPolicia}
//                   onChange={(e) => setCedulaPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Teléfono</label>
//                 <input
//                   type="text"
//                   value={telefonoPolicia}
//                   onChange={(e) => setTelefonoPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input
//                   type="text"
//                   value={emailPolicia}
//                   onChange={(e) => setEmailPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Password</label>
//                 <input
//                   type="text"
//                   value={passwordPolicia}
//                   onChange={(e) => setPasswordPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Género</label>
//                 <select
//                   value={generoPolicia}
//                   onChange={(e) => setGeneroPolicia(e.target.value)}
//                   className="w-full border border-gray-300 p-2 rounded"
//                 >
//                   <option value="">Seleccione</option>
//                   <option value="Masculino">Masculino</option>
//                   <option value="Femenino">Femenino</option>
//                   <option value="Otro">Otro</option>
//                 </select>
//               </div>
//               <div className="flex justify-between">
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsPoliciaModalOpen(false)}>
//                   Cancelar
//                 </button>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditPolicia}>
//                   {editingPoliciaIndex !== null ? 'Actualizar' : 'Agregar'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home3;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Home3 = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar los mensajes de error

  const [policias, setPolicias] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formType, setFormType] = useState(""); // 'policia' o 'admin'
  const [circuitos, setCircuitos] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    email: "",
    password: "",
    genero: "",
    idCircuito: "",
    roles: "",
  });

  useEffect(() => {
    const fetchCircuitos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/circuitos/");
        setCircuitos(response.data);
      } catch (error) {
        console.error("Error fetching circuitos:", error);
      }
    };

    fetchCircuitos();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000); // 5 segundos

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrEdit = async () => {
    const nuevoUsuario = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      cedula: formData.cedula,
      telefono: formData.telefono,
      email: formData.email,
      password: formData.password,
      genero: formData.genero, // Ahora aplicamos género a ambos tipos de usuario
      id_circuito: formData.idCircuito,
      roles: [formType === "policia" ? "Policia" : "Admin"],
    };

    try {
      await axios.post(
        "http://localhost:3000/personas/nuevoUsuario",
        nuevoUsuario
      );
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
        genero: "",
        idCircuito: "",
        roles: "",
      });
    } catch (error) {
      setErrorMessage("Error al registrar el usuario. Inténtelo de nuevo.");
      console.error("Error saving usuario:", error);
    }
  };

  const handleEdit = (index, type) => {
    const usuario =
      type === "policia" ? policias[index] : administradores[index];
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      telefono: usuario.telefono,
      email: usuario.email,
      password: usuario.password,
      genero: usuario.genero,
      idCircuito: usuario.idCircuito,
      roles: usuario.roles,
    });
    setFormType(type);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (index, type) => {
    if (type === "policia") {
      const policiasActualizados = [...policias];
      policiasActualizados.splice(index, 1);
      setPolicias(policiasActualizados);
    } else if (type === "admin") {
      const adminsActualizados = [...administradores];
      adminsActualizados.splice(index, 1);
      setAdministradores(adminsActualizados);
    }
  };

  const Notification = ({ message, type }) => {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`bg-white rounded-lg p-4 shadow-lg flex items-center space-x-2 transform transition-all duration-500 ease-in-out ${
            type === "success" ? "border-green-300" : "border-red-300"
          } ${
            type === "success"
              ? "translate-y-0 opacity-100"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div
            className={`flex items-center justify-center h-6 w-6 rounded-full ${
              type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {type === "success" ? (
              <svg
                className="h-5 w-5 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">{message}</h3>
          </div>
          <button
            onClick={() => {
              if (type === "success") setSuccessMessage("");
              else setErrorMessage("");
            }}
            className="ml-auto text-gray-500"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Sección de Gestión de Policías */}
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
        <div className="grid gap-4">
          {policias.map((policia, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 rounded flex justify-between items-center"
            >
              <div>
                <h6 className="text-lg font-bold">
                  {policia.nombres} {policia.apellidos}
                </h6>
                <p>Cédula: {policia.cedula}</p>
                <p>Teléfono: {policia.telefono}</p>
                <p>Email: {policia.email}</p>
                <p>Género: {policia.genero}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(index, "policia")}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(index, "policia")}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Gestión de Administradores */}
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
        <div className="grid gap-4">
          {administradores.map((admin, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 rounded flex justify-between items-center"
            >
              <div>
                <h6 className="text-lg font-bold">
                  {admin.nombres} {admin.apellidos}
                </h6>
                <p>Cédula: {admin.cedula}</p>
                <p>Teléfono: {admin.telefono}</p>
                <p>Email: {admin.email}</p>
                <p>Género: {admin.genero}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(index, "admin")}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(index, "admin")}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar/editar usuario (Policía o Administrador) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h5 className="text-xl font-bold mb-4">
              {isEditing
                ? `Editar ${
                    formType === "policia" ? "Policía" : "Administrador"
                  }`
                : `Agregar ${
                    formType === "policia" ? "Policía" : "Administrador"
                  }`}
            </h5>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Circuito</label>
              <select
                name="idCircuito"
                value={formData.idCircuito}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Seleccione un Circuito</option>
                {circuitos.map((circuito) => (
                  <option
                    key={circuito.id_circuito}
                    value={circuito.id_circuito}
                  >
                    {`${circuito.provincia} - ${circuito.ciudad} - ${circuito.barrio} - ${circuito.numero_circuito}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between">
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
      {errorMessage && <Notification message={errorMessage} type="error" />}
    </div>
  );
};

export default Home3;
