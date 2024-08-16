// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setAuthToken } from "../../utils/setAuthToken";


// const initialState = {
//   // token: localStorage.getItem("token"),
//   token: null,
//   isAuthenticated: null,
//   loading: true,
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess(state, action) {
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       state.loading = false;
//     },
//     userLoaded(state, action) {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       state.loading = false;
//     },
//     authError(state) {
//       state.token = null;
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.user = null;
//     },
//     logout(state) {
//       state.token = null;
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.user = null;
//     },
//   },
// });

// export const { loginSuccess, userLoaded, authError, logout } = authSlice.actions;

// export default authSlice.reducer;



// export const login = (email, password) => async (dispatch) => {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const body = JSON.stringify({ email, password });

//   try {
//     const res = await axios.post("http://localhost:3000/upc/login", body, config);
//     console.log("Respuesta de login:", res.data);

//     // Verificar si el usuario tiene el rol de Admin (ID de rol = 2)
//     if (res.data.user.roles && !res.data.user.roles.includes(2)) {
//       window.location.href = "/unauthorized";
//       return;
//     }

//     // localStorage.setItem("token", res.data.token);
//     setAuthToken(res.data.token); 
//     dispatch(loginSuccess({ token: res.data.token }));
//     dispatch(loadUser());
//     console.log("Login exitoso");
//   } catch (err) {
//     console.error("Error en login:", err); 
//     if (err.response && err.response.status === 401) {
//       // Muestra el mensaje de contraseña incorrecta
//       alert("Contraseña incorrecta. Inténtalo de nuevo.");
//     } else {
//       dispatch(authError());
//     }
//   }
// };

// export const loadUser = () => async (dispatch) => {
//   const token = getState().auth.token;
//   if (token) {
//     setAuthToken(token);
//   } else {
//     return; // No intentar cargar el usuario si no hay token
//   }

//   try {
//     const res = await axios.get("http://localhost:3000/upc/auth");
//     console.log("Usuario cargado:", res.data);
//     dispatch(userLoaded(res.data));
//   } catch (err) {
//     console.error("Error al cargar el usuario:", err);
//     dispatch(authError());
//   }
// };


// export const logoutUser = () => (dispatch) => {
//   setAuthToken(null); // Elimina el token de Axios
//   dispatch(logout());
//   console.log("Fin de la sesión"); // Muestra un mensaje en la consola al cerrar sesión
// };













import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "../../utils/setAuthToken";

const initialState = {
  token: null, // No usamos localStorage, mantenemos el token en el estado
  isAuthenticated: null,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
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
    dispatch(loginSuccess({ token: res.data.token }));
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
