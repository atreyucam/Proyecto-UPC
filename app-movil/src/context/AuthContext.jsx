import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
// const API_URL = "http://192.168.43.177:5000/api";
const API_URL = "http://localhost:5000/api";
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    errorLogin: null,
  });

  const login = async (userData) => {
    try {
      // dispatch(loginStart()); // Assuming this is not needed since it's not defined in the code snippet
      const response = await axios.post(`${API_URL}/auth/login-persona`, userData);
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
        errorLogin: null, // Clear any previous error messages
      });
      return true;
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      if (error.response) {
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

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      errorLogin: null, // Clear any error messages on logout
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
