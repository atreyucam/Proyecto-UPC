import { Button } from "@material-tailwind/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Home3 from "./pages/Home3";
import Home4 from "./pages/Home4";
import ConsultaSolicitudes from "./pages/ConsultaSolicitudes";
import ConsultaPolicias from "./pages/ConsultaPolicias";
import ConsultaCiudadanos from "./pages/ConsultaCiudadanos";
import DetallePolicia from "./pages/components/DetallePolicia";
import ProtectedRoute from "./pages/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />

          <Route path="/3" element={<Home3 />} />
          <Route path="/4" element={<Home4 />} />
          <Route path="/5" element={<ConsultaPolicias />} />
          <Route
            path="/ConsultaSolicitudes"
            element={<ConsultaSolicitudes />}
          />
          <Route path="/ConsultaCiudadanos" element={<ConsultaCiudadanos />} />
          <Route path="/policias/:id" element={<DetallePolicia />} />
        </Route>
        <Route path="/2" element={<Home2 />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
