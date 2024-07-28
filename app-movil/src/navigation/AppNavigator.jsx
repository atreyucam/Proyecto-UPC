import React from "react";
import { Route, Routes } from "react-router-native";
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

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeNavigation />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/registro" element={<RegistroScreen />} />
      <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
      <Route path="/misDenuncias" element={<MisDenunciasScreen />} />
      <Route path="/misServicios" element={<MisServiciosScreen />} />
      <Route path="/informacion" element={<InformacionScreen />} />
      <Route path="/miPerfil" element={<MiPerfilScreen />} />
      <Route path="/devs" element={<DevsScreen />} />
      <Route path="/denuncia/:denunciaId" element={<DenunciaItemScreen />} />
    </Routes>
  );
};

export default AppNavigator;
