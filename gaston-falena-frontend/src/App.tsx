import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

// Importamos los 3 Layouts
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout";
import BaseLayout from "./layouts/BaseLayout"; // <--- EL NUEVO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GRUPO 1: Rutas Universales (Todos pueden verlas) */}
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* GRUPO 2: Solo Invitados (Si estás logueado, te manda al dashboard) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* GRUPO 3: Solo Usuarios (Si NO estás logueado, te manda al login) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
