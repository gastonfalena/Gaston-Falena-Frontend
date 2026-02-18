import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../api/axios";

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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Organizador del Hogar 🏠</h1>
      <p>Controlá dónde están tus cosas: desde la habitación hasta el cajón.</p>
      <div>
        <h3>Estadísticas de la Comunidad</h3>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <p>
            Hay <strong>{totalItems}</strong> objetos organizados actualmente.
          </p>
        )}
      </div>
      <nav>
        <NavLink to="/login" style={{ marginRight: "1rem" }}>
          Iniciar Sesión
        </NavLink>
        <NavLink to="/register">Crear Cuenta</NavLink>
      </nav>
    </div>
  );
}
