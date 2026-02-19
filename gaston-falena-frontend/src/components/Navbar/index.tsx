import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏠 Inicio
      </Link>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
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
