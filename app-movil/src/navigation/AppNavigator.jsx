import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-native";
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
import HomeScreenPolicia from "../screens/policia/PoliceHomeScreen";
import PoliceNavigation from "./PoliceNavigation"; // Importa el nuevo PoliceNavigation
import { AuthContext } from "../context/AuthContext";

const AppNavigator = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unauthenticatedPaths = ["/login", "/registro", "/recuperar-cuenta"];
    if (
      !authState.isAuthenticated &&
      !unauthenticatedPaths.includes(location.pathname)
    ) {
      navigate("/login");
    }
  }, [authState.isAuthenticated, navigate, location.pathname]);

  return (
    <Routes>
      {authState.isAuthenticated ? (
        <>
          {authState.role.includes(4) && (
            <>
              <Route path="/" element={<HomeNavigation />} />
              <Route path="/misDenuncias" element={<MisDenunciasScreen />} />
              <Route path="/misServicios" element={<MisServiciosScreen />} />
              <Route path="/informacion" element={<InformacionScreen />} />
              <Route path="/miPerfil" element={<MiPerfilScreen />} />
              <Route path="/devs" element={<DevsScreen />} />
              <Route
                path="/denuncia/:denunciaId"
                element={<DenunciaItemScreen />}
              />
              <Route path="*" element={<HomeNavigation />} />
            </>
          )}
          {authState.role.includes(3) && (
            <>
              <Route path="/" element={<PoliceNavigation />} />
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
