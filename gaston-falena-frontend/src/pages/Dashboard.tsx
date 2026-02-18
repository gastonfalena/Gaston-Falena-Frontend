import { useEffect, useState } from "react";
import { api } from "../api/axios";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("¿Borrar objeto?")) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar objeto");
    }
  };

  const handleUpdateItem = async (item: Item) => {
    const newName = window.prompt("Nuevo nombre:", item.name);
    if (newName === null) return;

    const newQtyStr = window.prompt(
      "Nueva cantidad:",
      item.quantity.toString(),
    );
    if (newQtyStr === null) return;

    const newQty = Number(newQtyStr);
    if (isNaN(newQty) || newQty < 1) return alert("Cantidad inválida");

    try {
      await api.put(`/items/${item._id}`, {
        name: newName,
        quantity: newQty,
      });

      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, name: newName, quantity: newQty } : i,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  return (
    <div className="dashboard-container">
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
            style={{ marginLeft: "10px" }}
          />
          <button type="submit" className="btn-create">
            Crear
          </button>
        </form>

        <div className="list-houses">
          {houses.map((h) => (
            <button
              key={h._id}
              onClick={() => setSelectedHouseId(h._id)}
              className={
                selectedHouseId === h._id ? "card-house active" : "card-house"
              }
            >
              {h.name}
            </button>
          ))}
        </div>
      </section>

      {selectedHouseId && (
        <section className="section-containers">
          <h2>2. Contenedores</h2>
          <form className="form-create" onSubmit={handleCreateContainer}>
            <input
              type="text"
              placeholder="Nuevo Contenedor"
              value={newContainerName}
              onChange={(e) => setNewContainerName(e.target.value)}
              required
            />
            <button type="submit" className="btn-create">
              Crear
            </button>
          </form>

          <ul className="list-containers">
            {containers.map((c) => (
              <li
                key={c._id}
                className={
                  selectedContainerId === c._id
                    ? "item-container active"
                    : "item-container"
                }
              >
                <span className="item-name">{c.name}</span>
                <div className="item-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedContainerId(c._id)}
                  >
                    Ver Objetos
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteContainer(c._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {selectedContainerId && (
        <section className="section-items">
          <h2>3. Objetos</h2>
          <form className="form-create" onSubmit={handleCreateItem}>
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
              required
              min="1"
              className="input-qty"
            />
            <button type="submit" className="btn-create">
              Agregar
            </button>
          </form>

          <ul className="list-items">
            {items.map((i) => (
              <li key={i._id} className="item-row">
                <span className="item-info">
                  {i.name} (x{i.quantity})
                </span>

                <div className="item-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleUpdateItem(i)}
                  >
                    ✎
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteItem(i._id)}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
