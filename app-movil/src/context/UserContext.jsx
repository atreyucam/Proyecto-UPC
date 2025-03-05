import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "@env"; // Importar del .env
const UserContext = createContext();

console.log("API_ENDPOINT:", API_ENDPOINT); // Debe mostrar el URL de la API
const UserProvider = ({ children }) => {
    const [userState, setUserState] = useState({
        errorNewUser: null,
        isRegistered: false,
    });

    const registroUsuario = async (userData) => {
        try {
            const response = await axios.post(
                `${API_ENDPOINT}/persona/nuevoCiudadano`,
                userData
            );
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
