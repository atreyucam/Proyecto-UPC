import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { decode as atob } from "base-64";
import { API_ENDPOINT } from '@env';


const API_URL = API_ENDPOINT;
console.log("📌 API en uso:", API_URL);  

const AuthContext = createContext();

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
                if (
                    decodedToken.roles.includes(2) ||
                    decodedToken.roles.includes(3)
                ) {
                    setAuthState({
                        isAuthenticated: true,
                        token,
                        role: decodedToken.roles,
                        user: decodedToken.id_persona,
                        errorLogin: null,
                    });
                } else {
                    // Si el rol no es "Policía" o "Ciudadano", borra el token y marca como no autenticado
                    await SecureStore.deleteItemAsync("userToken");
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        token: null,
                        errorLogin: "Acceso no autorizado",
                        role: null,
                    });
                }
            }
        };

        loadToken();
    }, []);

    const login = async (userData) => {
        try {
            const response = await axios.post(`${API_ENDPOINT}/auth/login`, userData);

            const decodedToken = parseJwt(response.data.token);

            if (
                decodedToken.roles.includes(3) ||
                decodedToken.roles.includes(4)
            ) {
                await SecureStore.setItemAsync(
                    "userToken",
                    response.data.token
                );

                setAuthState({
                    isAuthenticated: true,
                    user: decodedToken.id_persona,
                    token: response.data.token,
                    errorLogin: null,
                    role: decodedToken.roles,
                });
                return true;
            } else {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    errorLogin: "Acceso no autorizado",
                    role: null,
                });
                return false;
            }
        } catch (error) {
            let errorMessage = "Error al iniciar sesión";
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                errorMessage = error.response.data.message;
            }
            setAuthState({
                isAuthenticated: false,
                user: null,
                token: null,
                errorLogin: errorMessage,
                role: null,
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
            var base64Url = token.split(".")[1];
            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );

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
