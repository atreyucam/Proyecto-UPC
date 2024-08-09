import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Home3 from "./pages/Home3";
import AsignarPolicias from "./pages/AsignarPolicias";
import ConsultaSolicitudes from "./pages/ConsultaSolicitudes";
import ConsultaPolicias from "./pages/ConsultaPolicias";
import ConsultaCiudadanos from "./pages/ConsultaCiudadanos";
import DetallePolicia from "./pages/components/DetallePolicia";
import DetalleCiudadano from "./pages/components/DetalleCiudadanos";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import DetalleSolicitud from "./pages/components/DetalleSolicitud";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige automáticamente a /login si la ruta es / */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/3" element={<Home3 />} />
          <Route path="/AsignarPolicias" element={<AsignarPolicias />} />
          <Route path="/ConsultaPolicias" element={<ConsultaPolicias />} />
          <Route path="/policias/:id" element={<DetallePolicia />} />
          <Route path="/ConsultaCiudadanos" element={<ConsultaCiudadanos />} />
          <Route path="/ciudadanos/:id" element={<DetalleCiudadano />} />
          <Route path="/ConsultaSolicitudes" element={<ConsultaSolicitudes />} />
          <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
