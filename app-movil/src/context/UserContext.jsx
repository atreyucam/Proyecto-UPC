import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
const API_URL = "http://192.168.43.177:5000/api";
//const API_URL = "http://localhost:5000/api";

const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState({
    errorNewUser: null,
    isRegistered: false,
  });

  const registroUsuario = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/personas`, userData);
      setUserState({
        errorNewUser: null,
        isRegistered: true,
      });
      return true;
    } catch (error) {
      let errorMessage = "Error al registrar usuario";
      if (error.response) {
        errorMessage = error.response.data.message;
      }
      setUserState({
        errorNewUser: errorMessage,
        isRegistered: false,
      });
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ userState, registroUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
