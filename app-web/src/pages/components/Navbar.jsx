import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../context/redux/authSlide";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const reduxDispatch = useDispatch(); // Hook de Redux para disparar acciones
  const navigate = useNavigate(); // Hook de React Router para redirigir
  const expirationTime = useSelector((state) => state.auth.expirationTime);

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (expirationTime) {
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
    }
  }, [expirationTime]);

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleLogout = () => {
    reduxDispatch(logoutUser()); // Disparar la acción de logout
    navigate("/login"); // Redirigir al usuario a la página de login
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Typography variant="h6" color="blue-gray">
            @UPC
          </Typography>
        </div>

        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Typography variant="small" className="text-blue-gray-500">
              {timeLeft
                ? `Su sesión expira en: ${formatTimeLeft(timeLeft)}`
                : ""}
            </Typography>
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* menu Notification menu */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          {/* Menu Ajustes */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />{" "}
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem
                className="flex items-center gap-3"
                onClick={handleLogout}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-1 font-normal"
                >
                  <strong>Salir</strong>
                </Typography>
              </MenuItem>
              <MenuItem className="flex items-center gap-3">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-1 font-normal"
                >
                  <strong>Ajustes</strong>
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
