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
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
