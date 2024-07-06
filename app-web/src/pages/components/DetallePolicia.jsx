import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PoliciaDetail = () => {
  const { id } = useParams();
  const [policia, setPolicia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicia = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/policias/${id}`
        );
        setPolicia(response.data);
      } catch (error) {
        console.error("Error fetching policia details", error);
      }
    };

    fetchPolicia();
  }, [id]);

  if (!policia) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-3 py-8">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate(-1)}
      >
        Regresar
      </button>

      <br />
      <br />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalles del Policía</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p>
          <strong>Cédula:</strong> {policia.cedula}
        </p>
        <p>
          <strong>Nombres:</strong> {policia.nombres}
        </p>
        <p>
          <strong>Apellidos:</strong> {policia.apellidos}
        </p>
        <p>
          <strong>Teléfono:</strong> {policia.telefono}
        </p>
        <p>
          <strong>Email:</strong> {policia.email}
        </p>
        <p>
          <strong>Provincia:</strong> {policia.Circuito.provincia}
        </p>
        <p>
          <strong>Ciudad:</strong> {policia.Circuito.ciudad}
        </p>
        <p>
          <strong>Barrio:</strong> {policia.Circuito.barrio}
        </p>
      </div>
    </div>
  );
};

export default PoliciaDetail;
