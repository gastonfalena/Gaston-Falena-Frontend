import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LOGO SIEMPRE FIJO: Te lleva a la Home */}
      <Link to="/" className="navbar-logo">
        🏠 Inicio
      </Link>

      <div className="navbar-links">
        {isAuthenticated ? (
          /* MENÚ DE USUARIO LOGUEADO */
          <>
            {/* Solo se muestra si estás logueado y reemplaza a "Dashboard" */}
            <Link
              to="/dashboard"
              className="nav-link"
              style={{ marginRight: "15px" }}
            >
              📦 Mi Inventario
            </Link>

            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </>
        ) : (
          /* MENÚ DE INVITADO (NO LOGUEADO) */
          <>
            <Link to="/login" className="nav-link">
              Ingresar
            </Link>
            <Link
              to="/register"
              className="nav-link"
              style={{ marginLeft: "15px" }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
