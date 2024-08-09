import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./Layout";

const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // Muestra un loader mientras se carga el usuario
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.roles && !user.roles.includes(2)) {  // Asegúrate de que `roles` esté definido antes de usar `includes`
    return <Navigate to="/unauthorized" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
