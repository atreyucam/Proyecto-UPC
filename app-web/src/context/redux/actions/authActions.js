import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../reducers/authReducer";
import axios from "axios";
import dotenv from "dotenv";

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/usuarios/login`,
      userData,
      {
        headers: {
          apiKey: process.env.REACT_APP_API_KEY, // Añade la API Key a los encabezados
        },
      }
    );
    dispatch(loginSuccess(response.data));
    return true; // Retornar datos de usuario para manejar en el componente
  } catch (error) {
    dispatch(
      loginFailure(error.response.data.message || "Error al iniciar sesión")
    );
    return false; // Relanzar el error para manejar en el componente
  }
};

export const logoutUser = () => async (dispatch) => {};
