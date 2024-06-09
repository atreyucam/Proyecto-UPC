import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MaterialTailwindControllerProvider>
        <App />
      </MaterialTailwindControllerProvider>
    </ThemeProvider>
  </React.StrictMode>
);
