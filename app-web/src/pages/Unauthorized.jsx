// src/pages/Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Typography variant="h2" className="mb-4">
        Acceso denegado
      </Typography>
      <Typography className="mb-8">
        No tienes permiso para acceder a esta página.
      </Typography>
      <Button onClick={() => navigate("/")} className="bg-blue-500">
        Volver al inicio
      </Button>
    </div>
  );
};

export default Unauthorized;
