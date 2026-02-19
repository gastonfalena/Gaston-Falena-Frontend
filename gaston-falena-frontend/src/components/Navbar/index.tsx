import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        🏠 Inicio
      </Link>

      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
              📦 Mi Inventario
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </>
        ) : (
          /* MENÚ INVITADO */
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              Ingresar
            </Link>
            <Link
              to="/register"
              className="nav-link btn-register-nav"
              onClick={closeMenu}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
