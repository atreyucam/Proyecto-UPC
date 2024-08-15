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
    console.log("Usuario cargado:", res.data);
    dispatch(userLoaded(res.data));
  } catch (err) {
    console.error("Error al cargar el usuario:", err);
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
    console.log("Respuesta de login:", res.data);

    // Verificar si el usuario tiene el rol de Admin (ID de rol = 2)
    if (res.data.user.roles && !res.data.user.roles.includes(2)) {
      window.location.href = "/unauthorized";
      return;
    }

    localStorage.setItem("token", res.data.token);
    dispatch(loginSuccess(res.data.token));
    console.log("Login exitoso");
    dispatch(loadUser());
  } catch (err) {
    console.error("Error en login:", err); 
    if (err.response && err.response.status === 401) {
      // Muestra el mensaje de contraseña incorrecta
      alert("Contraseña incorrecta. Inténtalo de nuevo.");
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
