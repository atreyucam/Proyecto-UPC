import React from "react";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import { Route, Routes } from "react-router-native";
import RegistroScreen from "../screens/RegistroScreen";
import RecuperarCuenta from "../screens/RecuperarCuenta";

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/registro" element={<RegistroScreen />} />
      <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
    </Routes>
  );
};

export default AppNavigator;
