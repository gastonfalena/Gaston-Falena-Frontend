// 1. IMPORTANTE: Importar Outlet
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProtectedLayout() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {/* 2. IMPORTANTE: El Outlet le dice a React "AQUÍ DIBUJA LA PÁGINA" */}
      <main style={{ padding: "2rem", paddingTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
}
