import React from "react";

const EstadoBadge = ({ estado, tipo }) => {
  const getBadgeClass = (estado, tipo) => {
    if (tipo === "estado") {
      switch (estado) {
        case "Pendiente":
          return "bg-blue-100 text-blue-800";
        case "En progreso":
          return "bg-yellow-100 text-yellow-800";
        case "Resuelto":
          return "bg-green-100 text-green-800";
        case "Falso":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else if (tipo === "disponibilidad") {
      switch (estado) {
        case "Disponible":
          return "bg-green-100 text-green-800";
        case "Ocupado":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 font-semibold text-sm rounded-full ${getBadgeClass(
        estado,
        tipo
      )}`}
    >
      {estado}
    </span>
  );
};

export default EstadoBadge;
