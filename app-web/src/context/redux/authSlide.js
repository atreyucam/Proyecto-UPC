import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "../../utils/setAuthToken";

const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

const initialState = {
  token: "SIMULATED_TOKEN",  // 🔥 Simula que ya hay un token válido
  isAuthenticated: true,      // 🔥 Fuerza autenticación
  loading: false,
  user: { 
    id: 1, 
    email: "alex.camacho@gmail.com", 
    roles: [2]  // 🔥 Asegurar que el usuario tenga el rol correcto
  },
  expirationTime: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user;
      state.expirationTime = action.payload.expirationTime;
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
      state.expirationTime = null;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.expirationTime = null;
    },
  },
});

export const { loginSuccess, userLoaded, authError, logout } = authSlice.actions;

export default authSlice.reducer;

// 🔹 Esta función de login sigue funcionando si se quiere probar el login real
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(`${API_URL}/auth/login`, body, config);

    if (res.data.user.roles && !res.data.user.roles.includes(2)) {
      window.location.href = "/unauthorized";
      return;
    }

    setAuthToken(res.data.token);
    dispatch(loginSuccess({ token: res.data.token, user: res.data.user, expirationTime: res.data.expiresIn }));
    dispatch(loadUser());
  } catch (err) {
    dispatch(authError());
  }
};

export const loadUser = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) return;

  try {
    const res = await axios.get(`${API_URL}/auth/authUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(userLoaded(res.data));
  } catch (err) {
    dispatch(authError());
  }
};

export const logoutUser = () => (dispatch) => {
  setAuthToken(null);
  dispatch(logout());
};
