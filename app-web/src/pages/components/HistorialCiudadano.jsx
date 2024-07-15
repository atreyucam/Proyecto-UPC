import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaFilePdf } from "react-icons/fa";


const HistorialCiudadano = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const historial = location.state?.historial;        

    if (!historial){
        return <div>Cargando...</div>;
    }


    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Detalles del Historial", 20, 10);
        doc.text(`Nombre y Apellidos: ${historial.nombre} ${historial.apellido}`, 20, 20);
        doc.text(`Tipo de Denuncia: ${historial.tipo}`, 20, 30);
        doc.text(`Duración: ${historial.duracion}`, 20, 40);
        doc.text(`Estado: ${historial.estado}`, 20, 50);
        doc.text(`Descripción: ${historial.descripcion}`, 20, 60);
        doc.save("historial.pdf");
      };

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
            <h1 className="text-2xl font-bold">Detalles del Historial</h1>
          </div>
          <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md mb-6">
            <table className="min-w-full bg-white border-gray-200 border rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b p-2">Nombre y Apellidos</th>
                  <th className="border-b p-2">Tipo de Denuncia</th>
                  <th className="border-b p-2">Duración</th>
                  <th className="border-b p-2">Estado</th>
                  <th className="border-b p-2">Descripción</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center cursor-pointer hover:bg-gray-200">
                  <td className="border-b p-2">{`${historial.nombre} ${historial.apellido}`}</td>
                  <td className="border-b p-2">{historial.tipo}</td>
                  <td className="border-b p-2">{historial.duracion}</td>
                  <td className="border-b p-2">{historial.estado}</td>
                  <td className="border-b p-2">{historial.descripcion}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
                      onClick={downloadPDF}
                    >
                      <FaFilePdf size={20} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    
};



 export default HistorialCiudadano;
