import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-native";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RecuperarCuenta from "../screens/RecuperarCuenta";
import HomeNavigation from "./HomeNavigation";
import MisDenunciasScreen from "../screens/MisDenunciasScreen";
import MisServiciosScreen from "../screens/MisServiciosScreen";
import InformacionScreen from "../screens/InformacionScreen";
import MiPerfilScreen from "../screens/MiPerfilScreen";
import DevsScreen from "../screens/DevsScreen";
import DenunciaItemScreen from "../screens/DenunciaItemScreen";
import { AuthContext } from "../context/AuthContext";

const AppNavigator = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login"); // Redirigir a la pantalla de inicio de sesión si no está autenticado
    } else {
      navigate("/"); // Redirigir a la pantalla principal si está autenticado
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <Routes>
      {authState.isAuthenticated ? (
        <>
          <Route path="/" element={<HomeNavigation />} />
          <Route path="/misDenuncias" element={<MisDenunciasScreen />} />
          <Route path="/misServicios" element={<MisServiciosScreen />} />
          <Route path="/informacion" element={<InformacionScreen />} />
          <Route path="/miPerfil" element={<MiPerfilScreen />} />
          <Route path="/devs" element={<DevsScreen />} />
          <Route path="/denuncia/:denunciaId" element={<DenunciaItemScreen />} />
          <Route path="*" element={<HomeNavigation />} /> {/* Ruta por defecto */}
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/registro" element={<RegistroScreen />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          <Route path="*" element={<LoginScreen />} /> {/* Ruta por defecto */}
        </>
      )}
    </Routes>
  );
};

export default AppNavigator;
