import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../../api/axios";
import "./Home.css";

export default function Home() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/items/total");
        setTotalItems(response.data.total);
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Organizador del Hogar 🏠</h1>
      <p className="home-subtitle">
        Controlá dónde están tus cosas: desde la habitación hasta el cajón.
      </p>

      <div className="stats-card">
        <h3>Estadísticas de la Comunidad</h3>
        {loading ? (
          <p className="loading-text">⏳ Cargando datos...</p>
        ) : (
          <p>
            Hay <strong className="stats-number">{totalItems}</strong> objetos
            organizados actualmente.
          </p>
        )}
      </div>

      <nav className="home-actions">
        <NavLink to="/login" className="btn-home btn-login">
          Iniciar Sesión
        </NavLink>
        <NavLink to="/register" className="btn-home btn-register">
          Crear Cuenta
        </NavLink>
      </nav>
    </div>
  );
}
