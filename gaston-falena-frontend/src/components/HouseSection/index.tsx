import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./HouseSection.css";

interface House {
  _id: string;
  name: string;
}

interface HouseSectionProps {
  onSelectHouse: (id: string) => void;
  selectedHouseId: string;
}

export default function HouseSection({
  onSelectHouse,
  selectedHouseId,
}: HouseSectionProps) {
  const [houses, setHouses] = useState<House[]>([]);
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseLocation, setNewHouseLocation] = useState("");

  const fetchHouses = async () => {
    try {
      const response = await api.get<House[]>("/houses");
      setHouses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchHouses();
  }, []);

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/houses", {
        name: newHouseName,
        location: newHouseLocation,
      });
      setNewHouseName("");
      setNewHouseLocation("");
      fetchHouses();
    } catch (error) {
      console.error(error);
      alert("Error al crear casa");
    }
  };

  return (
    <section className="section-houses">
      <h2>1. Mis Casas</h2>
      <form className="form-create" onSubmit={handleCreateHouse}>
        <input
          type="text"
          placeholder="Nombre de la casa"
          value={newHouseName}
          onChange={(e) => setNewHouseName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={newHouseLocation}
          onChange={(e) => setNewHouseLocation(e.target.value)}
          required
        />
        <button type="submit" className="btn-create">
          Crear
        </button>
      </form>

      <div className="list-houses">
        {houses.map((h) => (
          <button
            key={h._id}
            onClick={() => onSelectHouse(h._id)}
            className={
              selectedHouseId === h._id ? "card-house active" : "card-house"
            }
          >
            {h.name}
          </button>
        ))}
      </div>
    </section>
  );
}
