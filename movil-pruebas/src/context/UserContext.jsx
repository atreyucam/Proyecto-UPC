import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState({
    errorNewUser: null,
    isRegistered: false,
  });

  const registroUsuario = async (userData) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/usuarios`,
        userData
      );
      setUserState({
        errorNewUser: null,
        isRegistered: true,
      });
    } catch (error) {
      let errorMessage = "Error al registrar usuario";
      if (error.response) {
        errorMessage = error.response.data.message;
      }
      setUserState({
        errorNewUser: errorMessage,
        isRegistered: false,
      });
    }
  };

  return (
    <UserContext.Provider value={{ userState, registroUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
