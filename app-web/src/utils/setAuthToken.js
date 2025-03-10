import axios from "axios";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("✅ Token guardado en localStorage:", token);
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    console.warn("⚠️ Token eliminado");
  }
};
