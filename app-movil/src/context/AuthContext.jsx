import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { decode as atob } from 'base-64';

const AuthContext = createContext();

const API_URL = "http://192.168.0.11:3000";

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    errorLogin: null,
    role: null, 
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        const decodedToken = parseJwt(token);
        setAuthState({
          isAuthenticated: true,
          token,
          role: decodedToken.roles,  // Asegúrate de que el rol sea guardado correctamente
          user: decodedToken.id_persona,  // Guarda el id_persona
          errorLogin: null,
        });
      }
    };

    loadToken();
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/upc/login`, userData);
      console.log("Response data:", response.data);

      // Decodifica manualmente el token JWT
      const decodedToken = parseJwt(response.data.token);
      console.log("Decoded Token:", decodedToken);

      // Guarda el token en SecureStore
      await SecureStore.setItemAsync("userToken", response.data.token);

      setAuthState({
        isAuthenticated: true,
        user: decodedToken.id_persona,  // Guarda el id_persona desde el token
        token: response.data.token,
        errorLogin: null,
        role: decodedToken.roles,  // Decodifica y guarda los roles
      });
      return true;
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      let errorMessage = "Error al iniciar sesión";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        errorLogin: errorMessage,
      });
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      errorLogin: null,
      role: null,
    });
  };

  function parseJwt(token) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
