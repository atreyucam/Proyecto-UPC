import { Button } from "@material-tailwind/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Home2 from "./pages/Login";
import Home3 from "./pages/Home3";
import AsignarPolicias from "./pages/AsignarPolicias";
import ConsultaSolicitudes from "./pages/ConsultaSolicitudes";
import ConsultaPolicias from "./pages/ConsultaPolicias";
import ConsultaCiudadanos from "./pages/ConsultaCiudadanos";
import DetallePolicia from "./pages/components/DetallePolicia";
import DetalleCiudadano from "./pages/components/DetalleCiudadanos";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import DetalleSolicitud from "./pages/components/DetalleSolicitud";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/3" element={<Home3 />} />
          <Route path="/AsignarPolicias" element={<AsignarPolicias />} />
          {/* Rutas para policias */}
          <Route path="/ConsultaPolicias" element={<ConsultaPolicias />} />
          <Route path="/policias/:id" element={<DetallePolicia />} />
          {/* Rutas de ciudadanos */}
          <Route path="/ConsultaCiudadanos" element={<ConsultaCiudadanos />} />
          <Route path="/ciudadanos/:id" element={<DetalleCiudadano />} />
          {/* Rutas para solicitudes */}
          <Route path="/ConsultaSolicitudes" element={<ConsultaSolicitudes />} />
          <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
        </Route>

        {/* Ruta para login */}
        <Route path="/login" element={<Home2 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
