import {
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Typography,
    Navbar,
} from "@material-tailwind/react";
import {
    Cog6ToothIcon,
    BellIcon,
    ClockIcon,
    TrashIcon,
    Bars3Icon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useDispatch, useSelector } from "react-redux";
import {  logout } from "../../context/redux/authSlide";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../../services/socket";
import axios from "axios";

  const API_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;


export function DashboardNavbar() {
    // Control del estado de la barra lateral
    const [controller, dispatch] = useMaterialTailwindController();
    const { fixedNavbar, openSidenav } = controller;
    const reduxDispatch = useDispatch();
    const navigate = useNavigate();
    
    // Estado de la sesión y tiempo restante
    const expirationTime = useSelector((state) => state.auth.expirationTime);
    const [timeLeft, setTimeLeft] = useState(null);
    
    // Estado de notificaciones
    const [notificaciones, setNotificaciones] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    // ⏳ Manejo del tiempo de sesión
    useEffect(() => {
        if (!expirationTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remainingTime = Math.max(0, expirationTime - now);

            if (remainingTime <= 0) {
                clearInterval(interval);
                handleLogout();
                alert("Su sesión ha expirado. Por favor, vuelva a iniciar sesión.");
                window.location.reload();
            } else {
                setTimeLeft(remainingTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expirationTime]);

    // 🔔 Cargar notificaciones almacenadas en localStorage
    useEffect(() => {
        const storedNotificaciones = JSON.parse(localStorage.getItem("notificaciones")) || [];
        setNotificaciones(storedNotificaciones);
    }, []);

    // 🔔 Manejo de notificaciones en tiempo real con Socket.IO
    useEffect(() => {
        socket.on("nuevaNotificacion", (data) => {
            console.log("📢 Notificación recibida:", data);
            
            setNotificaciones((prev) => {
                const updatedNotificaciones = [...prev, data];
                localStorage.setItem("notificaciones", JSON.stringify(updatedNotificaciones));
                return updatedNotificaciones;
            });

            // Mostrar popup por 5 segundos
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 10000);
        });

        return () => {
            socket.off("nuevaNotificacion");
        };
    }, []);

    // 🗑️ Eliminar una notificación
    const eliminarNotificacion = async (id) => {
        try {
            await axios.delete(`${API_URL}/notificaciones/${id}`);
            setNotificaciones((prev) => {
                const updatedNotificaciones = prev.filter((noti) => noti.id !== id);
                localStorage.setItem("notificaciones", JSON.stringify(updatedNotificaciones));
                return updatedNotificaciones;
            });
        } catch (error) {
            console.error("❌ Error al eliminar la notificación:", error);
        }
    };

    // 🧹 Eliminar todas las notificaciones
    const eliminarTodas = () => {
        setNotificaciones([]);
        localStorage.removeItem("notificaciones");
    };

    // ⏳ Formatear tiempo restante en minutos y segundos
    const formatTimeLeft = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // 🚪 Cerrar sesión
    const handleLogout = () => {
        reduxDispatch(logout());
        navigate("/login");
    };

    return (
        <Navbar
            color={fixedNavbar ? "white" : "transparent"}
            className={`rounded-xl transition-all ${
                fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" : "px-0 py-1"
            }`}
            fullWidth
            blurred={fixedNavbar}
        >
            <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                <Typography variant="h6" color="blue-gray" className="capitalize">
                    @UPC Subzona No. 6 | Distrito Riobamba
                </Typography>

                <div className="flex items-center">
                    {/* ⏳ Tiempo restante de sesión */}
                    <div className="mr-auto md:mr-4 md:w-56">
                        <Typography variant="small" className="text-blue-gray-500">
                            {timeLeft ? `Su sesión expira en: ${formatTimeLeft(timeLeft)}` : ""}
                        </Typography>
                    </div>

                    {/* 📂 Botón para abrir el menú lateral */}
                    <IconButton
                        variant="text"
                        color="blue-gray"
                        className="grid xl:hidden"
                        onClick={() => setOpenSidenav(dispatch, !openSidenav)}
                    >
                        <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
                    </IconButton>

                    {/* 🔔 Notificaciones */}
                    <div className="relative">
                        {/* 📢 Popup de notificación flotante */}
                        {showPopup && notificaciones.length > 0 && (
                            <div className="absolute top-10 right-10 bg-green-400 p-3 w-64 rounded-lg shadow-lg border border-gray-300">
                            <Typography variant="small" className="font-semibold">
                                {notificaciones[notificaciones.length - 1].mensaje}
                            </Typography>
                        </div>
                        
                        )}

<Menu>
  <MenuHandler>
    <IconButton variant="text" color="blue-gray">
      <BellIcon className="h-5 w-5 text-blue-gray-500" />
      {notificaciones.length > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {notificaciones.length}
        </span>
      )}
    </IconButton>
  </MenuHandler>
  <MenuList className="w-80 border-0">
    <div className="flex justify-between p-2">
      <Typography variant="small" className="font-semibold">
        Notificaciones
      </Typography>
      <button onClick={eliminarTodas} className="text-red-500 text-xs">
        Limpiar todo
      </button>
    </div>
    {notificaciones.length === 0 ? (
      <MenuItem>No hay notificaciones</MenuItem>
    ) : (
      notificaciones.slice(-5).reverse().map((noti, index) => (
        <MenuItem key={index} className="flex items-center gap-3">
          <div>
            <Typography variant="small" className="mb-1 font-normal">
              <strong>{noti.mensaje}</strong>
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 text-xs font-normal opacity-60"
            >
              <ClockIcon className="h-3.5 w-3.5" />{" "}
              {new Date(noti.fecha_tiempo_creacion).toLocaleString()}
            </Typography>
          </div>
        </MenuItem>
      ))
    )}
  </MenuList>
</Menu>

                        {/* ⚙️ Menú de Ajustes */}
                    <Menu>
                        <MenuHandler>
                            <IconButton variant="text" color="blue-gray">
                                <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                            </IconButton>
                        </MenuHandler>
                        <MenuList className="w-max border-0">
                            <MenuItem className="flex items-center gap-3" onClick={handleLogout}>
                                <Typography variant="small" className="mb-1 font-normal">
                                    <strong>Salir</strong>
                                </Typography>
                            </MenuItem>
                            <MenuItem className="flex items-center gap-3">
                                <Typography variant="small" className="mb-1 font-normal">
                                    <strong>Ajustes</strong>
                                </Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    </div>
                </div>
            </div>
        </Navbar>
    );
}

export default DashboardNavbar;
