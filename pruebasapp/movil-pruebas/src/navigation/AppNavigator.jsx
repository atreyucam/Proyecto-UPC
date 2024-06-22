import React from "react";
import LoginScreen from "../screens/LoginScreen";
import { Route, Routes } from "react-router-native";
import RegistroScreen from "../screens/RegistroScreen";
import RecuperarCuenta from "../screens/RecuperarCuenta";
import HomeNavigation from "./HomeNavigation";

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeNavigation />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/registro" element={<RegistroScreen />} />
      <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
    </Routes>
  );
};

export default AppNavigator;
