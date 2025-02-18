import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-native";
import { Alert, BackHandler } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RecuperarCuenta from "../screens/RecuperarCuenta";
import HomeNavigation from "./HomeNavigation"; // Navigation para roles diferentes de policía
import MisDenunciasScreen from "../screens/MisDenunciasScreen";
import MisServiciosScreen from "../screens/MisServiciosScreen";
import InformacionScreen from "../screens/InformacionScreen";
import MiPerfilScreen from "../screens/MiPerfilScreen";
import DevsScreen from "../screens/DevsScreen";
import DenunciaItemScreen from "../screens/DenunciaItemScreen";
import PoliceNavigation from "./PoliceNavigation"; // Navigation para el rol de policía
import { AuthContext } from "../context/AuthContext";
import SolicitudesAsignadasScreen from "../screens/policia/solicitudesAsignadasScreen";
import DenunciaItemPoliceScreen from "../screens/policia/DenunciaItemPoliceScreen";
import ResumenActividad from "../screens/policia/ResumenActividadScreen";
import EmergenciaScreen from "../screens/Emergencia";
import ActualizarContrasenaScreen from "../screens/ActualizarContrasenaScreen";

const AppNavigator = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const unauthenticatedPaths = ["/login", "/registro", "/recuperar-cuenta"];
  
  useEffect(() => {
    if (!authState.isAuthenticated && !unauthenticatedPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [authState.isAuthenticated, navigate, location.pathname]);

  useEffect(() => {
    const backAction = () => {
      if (location.pathname === "/") {
        Alert.alert(
          "Salir",
          "¿Estás seguro que deseas salir de la aplicación?",
          [
            { text: "Cancelar", onPress: () => null, style: "cancel" },
            { text: "Sí", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      } else if (location.pathname !== "/" && location.pathname !== "/login") {
        navigate(-1);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {authState.isAuthenticated ? (
        <>
          {authState.role.includes(4) && ( // para ciudadanos
            <>
              <Route path="/" element={<HomeNavigation />} />
              <Route path="/misDenuncias" element={<MisDenunciasScreen />} />
              <Route path="/misServicios" element={<MisServiciosScreen />} />
              <Route path="/informacion" element={<InformacionScreen />} />
              <Route path="/miPerfil" element={<MiPerfilScreen />} />
              <Route path="/devs" element={<DevsScreen />} />
              <Route path="/denuncia/:denunciaId" element={<DenunciaItemScreen />} />
              <Route path="/actualizarContrasena" element={<ActualizarContrasenaScreen />} />
              <Route path="*" element={<HomeNavigation />} />
            </>
          )}
          {authState.role.includes(3) && (  // Rol 3 para Policía
            <>
              <Route path="/" element={<PoliceNavigation />} />
              <Route path="/denunciasAsignadas" element={<SolicitudesAsignadasScreen />} />
              <Route path="/denuncia/:denunciaId" element={<DenunciaItemPoliceScreen />} />
              <Route path="/resumenActividad" element={<ResumenActividad />} />
              <Route path="/Emergencia" element={<EmergenciaScreen />} />
              <Route path="/actualizarContrasena" element={<ActualizarContrasenaScreen />} />
              <Route path="*" element={<PoliceNavigation />} />
            </>
          )}
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/registro" element={<RegistroScreen />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          <Route path="*" element={<LoginScreen />} />
        </>
      )}
    </Routes>
  );
};

export default AppNavigator;
