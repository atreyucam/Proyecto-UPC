import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "@env"; // Importar del .env
const UserContext = createContext();
// const API_ENDPOINT = "http://10.0.2.2:3000";
// const API_ENDPOINT = "http://192.168.0.13:3000";
// const API_ENDPOINT = "http://192.168.0.14:3000";

const UserProvider = ({ children }) => {
    const [userState, setUserState] = useState({
        errorNewUser: null,
        isRegistered: false,
    });

    const registroUsuario = async (userData) => {
        try {
            const response = await axios.post(
                `${API_ENDPOINT}/personas/nuevoCiudadano`,
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
