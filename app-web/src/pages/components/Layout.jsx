import React from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./Navbar";
import { IconButton } from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const Layout = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-blue-gray-50/50">
        <Sidebar />
        <div className="p-4 xl:ml-80">
          <DashboardNavbar />
          <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
            ripple={false}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Layout;
