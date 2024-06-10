import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./Layout";
const ProtectedRoute = () => {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};

export default ProtectedRoute;
