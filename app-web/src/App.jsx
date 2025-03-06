import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistroPolicia from "./pages/RegistroPolicia";
import AsignarPolicias from "./pages/AsignarPolicias";
import ConsultaSolicitudes from "./pages/ConsultaSolicitudes";
import ConsultaPolicias from "./pages/ConsultaPolicias";
import ConsultaCiudadanos from "./pages/ConsultaCiudadanos";
import DetallePolicia from "./pages/components/DetallePolicia";
import DetalleCiudadano from "./pages/components/DetalleCiudadanos";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import DetalleSolicitud from "./pages/components/DetalleSolicitud";
import Unauthorized from "./pages/Unauthorized";
import Reporte  from "./pages/Reporte";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./context/redux/authSlide";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

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
          <Route path="/RegistroPolicia" element={<RegistroPolicia />} />
          <Route path="/AsignarPolicias" element={<AsignarPolicias />} />
          <Route path="/ConsultaPolicias" element={<ConsultaPolicias />} />
          <Route path="/policias/:id" element={<DetallePolicia />} />
          <Route path="/ConsultaCiudadanos" element={<ConsultaCiudadanos />} />
          <Route path="/ciudadanos/:id" element={<DetalleCiudadano />} />
 
          <Route
            path="/ConsultaSolicitudes"
            element={<ConsultaSolicitudes />}
          />
          <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
          <Route path="/reporte" element={<Reporte />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
