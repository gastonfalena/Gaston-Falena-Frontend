import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({ items: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/public/stats") // falta hacer endpoint en el backend
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
}
