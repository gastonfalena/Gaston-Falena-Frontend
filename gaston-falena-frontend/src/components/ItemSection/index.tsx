import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./ItemSection.css";

interface Item {
  _id: string;
  name: string;
  quantity: number;
}

interface ItemSectionProps {
  containerId: string;
}

export default function ItemSection({ containerId }: ItemSectionProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const fetchItems = async () => {
    try {
      const response = await api.get<Item[]>(
        `/items?containerId=${containerId}`,
      );
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/items", {
        name: newItemName,
        quantity: newItemQty,
        containerId: containerId,
      });
      setNewItemName("");
      setNewItemQty(1);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Error al crear ítem");
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
      await api.put(`/items/${item._id}`, { name: newName, quantity: newQty });
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
    <section className="section-items">
      <h2>Objetos</h2>
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
          style={{ width: "70px" }}
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
              <button className="btn-edit" onClick={() => handleUpdateItem(i)}>
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
  );
}
