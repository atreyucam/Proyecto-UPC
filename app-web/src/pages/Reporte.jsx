import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ResumenGeneral from "./reportes/ResumenGeneral";
import DesempenoPolicial from "./reportes/DesempenoPolicial";
import TiposEmergencias from "./reportes/TiposEmergencias";
import UbicacionGeografica from "./reportes/UbicacionGeografica";
import Administrativos from "./reportes/Administrativos";

const Reportes = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">📊 Reportes</h1>
            
            {/* Menú de navegación */}
            <nav className="mb-4 flex gap-4 border-b pb-2">
                <NavLink to="resumen" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Resumen General</NavLink>
                <NavLink to="desempeno" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Desempeño Policial</NavLink>
                <NavLink to="tipos" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Tipos de Emergencias</NavLink>
                <NavLink to="ubicacion" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Ubicación</NavLink>
                <NavLink to="administrativos" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-600"}>Administrativos</NavLink>
            </nav>

             {/* Contenedor para las subrutas */}
             <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Reportes;
