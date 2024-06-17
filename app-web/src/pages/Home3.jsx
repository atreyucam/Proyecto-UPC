import React, { useState } from 'react';
import Layout from './components/Layout';

const Home3 = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [numeroCircuito, setNumeroCircuito] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOrEditSolicitud = () => {
    const nuevaSolicitud = { nombre, provincia, ciudad, barrio, numeroCircuito };
    if (editingIndex !== null) {
      const solicitudesActualizadas = [...solicitudes];
      solicitudesActualizadas[editingIndex] = nuevaSolicitud;
      setSolicitudes(solicitudesActualizadas);
    } else {
      setSolicitudes([...solicitudes, nuevaSolicitud]);
    }
    setIsModalOpen(false);
    setNombre('');
    setProvincia('');
    setCiudad('');
    setBarrio('');
    setNumeroCircuito('');
    setEditingIndex(null);
  };

  const handleEditSolicitud = (index) => {
    const solicitud = solicitudes[index];
    setNombre(solicitud.nombre);
    setProvincia(solicitud.provincia);
    setCiudad(solicitud.ciudad);
    setBarrio(solicitud.barrio);
    setNumeroCircuito(solicitud.numeroCircuito);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteSolicitud = (index) => {
    const solicitudesActualizadas = [...solicitudes];
    solicitudesActualizadas.splice(index, 1);
    setSolicitudes(solicitudesActualizadas);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-2xl font-bold">Gestión de Circuitos</h4>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(true)}>
          Agregar Circuito
        </button>
      </div>
      <div className="grid gap-4">
        {solicitudes.map((solicitud, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
            <div>
              <h6 className="text-lg font-bold">{solicitud.nombre}</h6>
              <p>{solicitud.provincia}, {solicitud.ciudad}, {solicitud.barrio}</p>
              <p>Número de Circuito: {solicitud.numeroCircuito}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditSolicitud(index)}>
                Editar
              </button>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteSolicitud(index)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h5 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Editar Solicitud' : 'Agregar Solicitud'}</h5>
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre"
                className="border p-2 rounded"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Provincia"
                className="border p-2 rounded"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ciudad"
                className="border p-2 rounded"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
              <input
                type="text"
                placeholder="Barrio"
                className="border p-2 rounded"
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
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
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddOrEditSolicitud}>
                {editingIndex !== null ? 'Guardar Cambios' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home3;
