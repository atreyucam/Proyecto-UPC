import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "./index.css";
import { persistor, store } from "./context/redux/stateManagement";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <MaterialTailwindControllerProvider>
            <App />
          </MaterialTailwindControllerProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
