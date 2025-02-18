
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "../../utils/setAuthToken";

const initialState = {
  token: null, // No usamos localStorage, mantenemos el token en el estado
  isAuthenticated: null,
  loading: true,
  user: null,
  expirationTime: null,  // Añadido: para almacenar el tiempo de expiración
};

console.log("s");
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.expirationTime = action.payload.expirationTime;  // Añadido
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
      state.expirationTime = null;  // Añadido
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.expirationTime = null;  // Añadido
    },
  },
});

export const { loginSuccess, userLoaded, authError, logout } = authSlice.actions;

export default authSlice.reducer;

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://localhost:3000/upc/login", body, config);
    

    if (res.data.user.roles && !res.data.user.roles.includes(2)) {
      window.location.href = "/unauthorized";
      return;
    }

    setAuthToken(res.data.token); 
    dispatch(loginSuccess({ token: res.data.token, expirationTime: res.data.expiresIn }));
    dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.status === 404) {
      alert("Usuario no encontrado. Por favor verifica tu email.");
    } else if (err.response && err.response.status === 401) {
      alert("Contraseña incorrecta. Inténtalo de nuevo.");
    } else {
      dispatch(authError());
    }
  }
};

export const loadUser = () => async (dispatch, getState) => {
  const token = getState().auth.token;

  if (token) {
    setAuthToken(token); 
  } else {
    return;
  }

  try {
    const res = await axios.get("http://localhost:3000/upc/auth");
    dispatch(userLoaded(res.data));
  } catch (err) {
    dispatch(authError());
  }
};

export const logoutUser = () => (dispatch) => {
  setAuthToken(null); // Elimina el token de Axios
  dispatch(logout());
};
