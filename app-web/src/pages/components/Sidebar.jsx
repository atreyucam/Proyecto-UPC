import React from "react";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

const Sidebar = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  return (
    <>
      <aside
        className={`bg-white shadow-sm  ${
          openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-black-gray-100`}
      >
        <div className={`relative`}>
          <Link to="/" className="py-6 px-8 text-center">
            <Typography variant="h6">UPC - app Web</Typography>
          </Link>
          <IconButton
            variant="text"
            color="white"
            size="sm"
            ripple={false}
            className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            onClick={() => setOpenSidenav(dispatch, false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-black" />
          </IconButton>
        </div>
        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-1">
            <li>
              <NavLink to="/home" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Home
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/3" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Solicitud
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/AsignarPolicias" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Asignar Policias
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/ConsultaPolicias" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Consulta Policias
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/ConsultaCiudadanos" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Consulta ciudadanos
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/ConsultaSolicitudes" exact>
                {({ isActive }) => (
                  <Button
                    className={`flex items-center gap-4 px-4 py-2 capitalize fullWidth ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    variant={isActive ? "gradient" : "text"}
                    fullWidth
                  >
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Consulta Solicitudes
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
