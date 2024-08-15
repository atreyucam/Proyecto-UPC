import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "../../utils/setAuthToken";
import { useNavigate } from "react-router-dom";  // Asegúrate de importar esto si estás en un componente React

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    userLoaded(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    authError(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, userLoaded, authError, logout } = authSlice.actions;

export default authSlice.reducer;

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("http://localhost:3000/upc/auth");
    dispatch(userLoaded(res.data));
  } catch (err) {
    dispatch(authError());
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://localhost:3000/upc/login", body, config);
    localStorage.setItem("token", res.data.token);
    dispatch(loginSuccess(res.data.token));
    dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Si la respuesta es 401, redirigir a la página de "No Autorizado"
      console.log("Usuario no autorizado, redirigiendo a la pantalla de no autorizado");
      window.location.href = "/unauthorized"; // Redirige a la pantalla de "No Autorizado"
    } else {
      dispatch(authError());
    }
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(logout());
  console.log("Fin de la sesión"); // Muestra un mensaje en la consola al cerrar sesión
};
