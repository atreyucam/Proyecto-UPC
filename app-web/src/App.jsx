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
import Reporte  from "./pages/Reporte";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./context/redux/authSlide";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Para login y registro */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas dentro de la app */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/3" element={<Home3 />} />
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
