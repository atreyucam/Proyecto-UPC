import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.errorMessage = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload;
      state.errorMessage = null;
    },
    loginFailure(state, action) {
      state.isAuthenticated = false;
      state.loading = false;
      state.errorMessage = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null
      state.errorMessage = null
      state.loading = false
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;