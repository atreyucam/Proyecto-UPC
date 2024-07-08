import React, { useState } from 'react';
import Layout from './components/Layout';

const Home3 = () => {
  
  // Estado para gestionar circuitos
  const [solicitudes, setSolicitudes] = useState([]);
  const [isCircuitoModalOpen, setIsCircuitoModalOpen] = useState(false);
  const [nombreCircuito, setNombreCircuito] = useState('');
  const [provinciaCircuito, setProvinciaCircuito] = useState('');
  const [ciudadCircuito, setCiudadCircuito] = useState('');
  const [barrioCircuito, setBarrioCircuito] = useState('');
  const [numeroCircuito, setNumeroCircuito] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Estado para gestionar administradores
  const [administradores, setAdministradores] = useState([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [nombreAdmin, setNombreAdmin] = useState('');
  const [apellidoAdmin, setApellidoAdmin] = useState('');
  const [cedulaAdmin, setCedulaAdmin] = useState('');
  const [rangoAdmin, setRangoAdmin] = useState('');
  const [direccionAdmin, setDireccionAdmin] = useState('');
  const [telefonoAdmin, setTelefonoAdmin] = useState('');
  const [editingAdminIndex, setEditingAdminIndex] = useState(null);

  // Funciones para gestionar circuitos
  const handleAddOrEditCircuito = () => {
    const nuevoCircuito = { nombre: nombreCircuito, provincia: provinciaCircuito, ciudad: ciudadCircuito, barrio: barrioCircuito, numeroCircuito };
    if (editingIndex !== null) {
      const circuitosActualizados = [...solicitudes];
      circuitosActualizados[editingIndex] = nuevoCircuito;
      setSolicitudes(circuitosActualizados);
    } else {
      setSolicitudes([...solicitudes, nuevoCircuito]);
    }
    setIsCircuitoModalOpen(false);
    setNombreCircuito('');
    setProvinciaCircuito('');
    setCiudadCircuito('');
    setBarrioCircuito('');
    setNumeroCircuito('');
    setEditingIndex(null);
  };

  const handleEditCircuito = (index) => {
    const circuito = solicitudes[index];
    setNombreCircuito(circuito.nombre);
    setProvinciaCircuito(circuito.provincia);
    setCiudadCircuito(circuito.ciudad);
    setBarrioCircuito(circuito.barrio);
    setNumeroCircuito(circuito.numeroCircuito);
    setEditingIndex(index);
    setIsCircuitoModalOpen(true);
  };

  const handleDeleteCircuito = (index) => {
    const circuitosActualizados = [...solicitudes];
    circuitosActualizados.splice(index, 1);
    setSolicitudes(circuitosActualizados);
  };

  // Funciones para gestionar administradores
  const handleAddOrEditAdmin = () => {
    const nuevoAdmin = { nombre: nombreAdmin, apellido: apellidoAdmin, cedula: cedulaAdmin, rango: rangoAdmin, direccion: direccionAdmin, telefono: telefonoAdmin };
    if (editingAdminIndex !== null) {
      const adminsActualizados = [...administradores];
      adminsActualizados[editingAdminIndex] = nuevoAdmin;
      setAdministradores(adminsActualizados);
    } else {
      setAdministradores([...administradores, nuevoAdmin]);
    }
    setIsAdminModalOpen(false);
    setNombreAdmin('');
    setApellidoAdmin('');
    setCedulaAdmin('');
    setRangoAdmin('');
    setDireccionAdmin('');
    setTelefonoAdmin('');
    setEditingAdminIndex(null);
  };

  const handleEditAdmin = (index) => {
    const admin = administradores[index];
    setNombreAdmin(admin.nombre);
    setApellidoAdmin(admin.apellido);
    setCedulaAdmin(admin.cedula);
    setRangoAdmin(admin.rango);
    setDireccionAdmin(admin.direccion);
    setTelefonoAdmin(admin.telefono);
    setEditingAdminIndex(index);
    setIsAdminModalOpen(true);
  };

  const handleDeleteAdmin = (index) => {
    const adminsActualizados = [...administradores];
    adminsActualizados.splice(index, 1);
    setAdministradores(adminsActualizados);
  };
  

  return (
    <div className="container mx-auto p-4">
      {/* Sección de Gestión de Circuitos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold">Gestión de Circuitos</h4>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsCircuitoModalOpen(true)}>
            Agregar

          </button>
        </div>
        <div className="grid gap-4">
          {solicitudes.map((circuito, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
              <div>
                <h6 className="text-lg font-bold">{circuito.nombre}</h6>
                <p>{circuito.provincia}, {circuito.ciudad}, {circuito.barrio}</p>
                <p>Número de Circuito: {circuito.numeroCircuito}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditCircuito(index)}>
                  Editar
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteCircuito(index)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Modal para agregar/editar circuito */}
        {isCircuitoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h5 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Editar Circuito' : 'Agregar Circuito'}</h5>
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border p-2 rounded"
                  value={nombreCircuito}
                  onChange={(e) => setNombreCircuito(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Provincia"
                  className="border p-2 rounded"
                  value={provinciaCircuito}
                  onChange={(e) => setProvinciaCircuito(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="border p-2 rounded"
                  value={ciudadCircuito}
                  onChange={(e) => setCiudadCircuito(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Barrio"
                  className="border p-2 rounded"
                  value={barrioCircuito}
                  onChange={(e) => setBarrioCircuito(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Número de Circuito"
                  className="border p-2 rounded"
                  value={numeroCircuito}
                  onChange={(e) => setNumeroCircuito(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsCircuitoModalOpen(false)}>
                  Cancelar
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditCircuito}>
                  {editingIndex !== null ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Gestionar Administradores */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold">Gestionar Administradores</h4>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsAdminModalOpen(true)}>
            Agregar 
          </button>
        </div>
        <div className="grid gap-4">
          {administradores.map((admin, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
              <div>
                <h6 className="text-lg font-bold">{admin.nombre} {admin.apellido}</h6>
                <p>Cédula: {admin.cedula}</p>
                <p>Rango: {admin.rango}</p>
                <p>Dirección: {admin.direccion}</p>
                <p>Teléfono: {admin.telefono}</p>
              </div>
              <div>
                <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditAdmin(index)}>
                  Editar
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteAdmin(index)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Modal para agregar/editar administrador */}
        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h5 className="text-xl font-bold mb-4">{editingAdminIndex !== null ? 'Editar Administrador' : 'Agregar Administrador'}</h5>
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border p-2 rounded"
                  value={nombreAdmin}
                  onChange={(e) => setNombreAdmin(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="border p-2 rounded"
                  value={apellidoAdmin}
                  onChange={(e) => setApellidoAdmin(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Cédula"
                  className="border p-2 rounded"
                  value={cedulaAdmin}
                  onChange={(e) => setCedulaAdmin(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Rango"
                  className="border p-2 rounded"
                  value={rangoAdmin}
                  onChange={(e) => setRangoAdmin(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  className="border p-2 rounded"
                  value={direccionAdmin}
                  onChange={(e) => setDireccionAdmin(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  className="border p-2 rounded"
                  value={telefonoAdmin}
                  onChange={(e) => setTelefonoAdmin(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsAdminModalOpen(false)}>
                  Cancelar
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditAdmin}>
                  {editingAdminIndex !== null ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Home3;
