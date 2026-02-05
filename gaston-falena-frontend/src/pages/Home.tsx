import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [stats, setStats] = useState({ items: 0 });

  useEffect(() => {
    // Pegarle a una ruta pública que crearemos luego
    axios
      .get("http://localhost:3000/api/public/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="landing">
      <h1>Organizador de Hogar 🏠</h1>
      <p>Controlá dónde están tus cosas de forma jerárquica.</p>
      <div className="stats">
        Actualmente hay <strong>{stats.items}</strong> objetos organizados.
      </div>
      <a href="/login">Comenzar a organizar</a>
    </div>
  );
};
