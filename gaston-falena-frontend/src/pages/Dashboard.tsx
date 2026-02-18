import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

interface House {
  _id: string;
  name: string;
}

interface Container {
  _id: string;
  name: string;
  house: string;
}

interface Item {
  _id: string;
  name: string;
  quantity: number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [houses, setHouses] = useState<House[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [selectedHouseId, setSelectedHouseId] = useState<string>("");
  const [selectedContainerId, setSelectedContainerId] = useState<string>("");

  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseLocation, setNewHouseLocation] = useState("");
  const [newContainerName, setNewContainerName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const fetchHouses = async () => {
    try {
      const response = await api.get<House[]>("/houses");
      setHouses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContainers = async () => {
    if (!selectedHouseId) return;
    try {
      const response = await api.get<Container[]>(
        `/containers?houseId=${selectedHouseId}`,
      );
      setContainers(response.data);
      setItems([]);
      setSelectedContainerId("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async () => {
    if (!selectedContainerId) return;
    try {
      const response = await api.get<Item[]>(
        `/items?containerId=${selectedContainerId}`,
      );
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchHouses();
  }, []);

  useEffect(() => {
    if (selectedHouseId) {
      fetchContainers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHouseId]);

  useEffect(() => {
    if (selectedContainerId) {
      fetchItems();
    }
  }, [selectedContainerId]);

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

  const handleCreateContainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHouseId) return alert("Selecciona una casa primero");

    try {
      await api.post("/containers", {
        name: newContainerName,
        houseId: selectedHouseId,
      });
      setNewContainerName("");
      fetchContainers();
    } catch (error) {
      console.error(error);
      alert("Error al crear contenedor");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContainerId) return alert("Selecciona un contenedor primero");

    try {
      await api.post("/items", {
        name: newItemName,
        quantity: newItemQty,
        containerId: selectedContainerId,
      });
      setNewItemName("");
      setNewItemQty(1);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Error al crear ítem");
    }
  };

  const handleDeleteContainer = async (id: string) => {
    if (!window.confirm("¿Borrar contenedor?")) return;
    try {
      await api.delete(`/containers/${id}`);
      setContainers((prev) => prev.filter((c) => c._id !== id));

      if (selectedContainerId === id) {
        setSelectedContainerId("");
        setItems([]);
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  // --- NUEVA FUNCIÓN: ELIMINAR ITEM ---
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("¿Borrar objeto?")) return;
    try {
      await api.delete(`/items/${id}`);
      // Actualizamos la lista visualmente quitando el item borrado
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar objeto");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Panel de Control</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <section>
        <h2>Casas</h2>
        <form onSubmit={handleCreateHouse}>
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
            style={{ marginLeft: "10px" }}
          />
          <button type="submit" style={{ marginLeft: "10px" }}>
            Crear
          </button>
        </form>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {houses.map((h) => (
            <button
              key={h._id}
              onClick={() => setSelectedHouseId(h._id)}
              style={{
                fontWeight: selectedHouseId === h._id ? "bold" : "normal",
                backgroundColor: selectedHouseId === h._id ? "#ccc" : "#eee",
                padding: "5px 10px",
                cursor: "pointer",
                border: "1px solid #999",
              }}
            >
              {h.name}
            </button>
          ))}
        </div>
      </section>

      {selectedHouseId && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Contenedores</h2>
          <form onSubmit={handleCreateContainer}>
            <input
              type="text"
              placeholder="Nuevo Contenedor"
              value={newContainerName}
              onChange={(e) => setNewContainerName(e.target.value)}
              required
            />
            <button type="submit" style={{ marginLeft: "10px" }}>
              Crear
            </button>
          </form>

          <ul style={{ marginTop: "10px" }}>
            {containers.map((c) => (
              <li key={c._id} style={{ marginBottom: "5px" }}>
                <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                  {c.name}
                </span>
                <button onClick={() => setSelectedContainerId(c._id)}>
                  Ver Objetos
                </button>
                <button
                  onClick={() => handleDeleteContainer(c._id)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {selectedContainerId && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Objetos</h2>
          <form onSubmit={handleCreateItem}>
            <input
              type="text"
              placeholder="Objeto"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cant"
              value={newItemQty}
              onChange={(e) => setNewItemQty(Number(e.target.value))}
              style={{ width: "60px", marginLeft: "10px" }}
              required
              min="1"
            />
            <button type="submit" style={{ marginLeft: "10px" }}>
              Agregar
            </button>
          </form>

          <ul style={{ marginTop: "10px" }}>
            {items.map((i) => (
              <li key={i._id} style={{ marginBottom: "5px" }}>
                {/* Nombre y Cantidad */}
                <span>
                  {i.name} (x{i.quantity})
                </span>

                {/* BOTÓN DE ELIMINAR ÍTEM */}
                <button
                  onClick={() => handleDeleteItem(i._id)}
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
