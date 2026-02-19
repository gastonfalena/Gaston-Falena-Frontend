import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import ItemSection from "../ItemSection";
import "./ContainerSection.css";

interface Container {
  _id: string;
  name: string;
}

interface ContainerSectionProps {
  houseId: string;
  onSelectContainer: (id: string) => void;
  selectedContainerId: string;
}

export default function ContainerSection({
  houseId,
  onSelectContainer,
  selectedContainerId,
}: ContainerSectionProps) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [newContainerName, setNewContainerName] = useState("");

  const fetchContainers = async () => {
    try {
      const response = await api.get<Container[]>(
        `/containers?houseId=${houseId}`,
      );
      setContainers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);

  const handleCreateContainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/containers", {
        name: newContainerName,
        houseId: houseId,
      });
      setNewContainerName("");
      fetchContainers();
    } catch (error) {
      console.error(error);
      alert("Error al crear contenedor");
    }
  };

  const handleDeleteContainer = async (id: string) => {
    if (!window.confirm("¿Borrar contenedor?")) return;
    try {
      await api.delete(`/containers/${id}`);
      setContainers((prev) => prev.filter((c) => c._id !== id));
      if (selectedContainerId === id) {
        onSelectContainer("");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  return (
    <section className="section-containers">
      <h2>Contenedores</h2>
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
          <li key={c._id} style={{ display: "flex", flexDirection: "column" }}>
            <div
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
                  onClick={() =>
                    onSelectContainer(
                      selectedContainerId === c._id ? "" : c._id,
                    )
                  }
                >
                  {selectedContainerId === c._id ? "Ocultar" : "Ver Objetos"}
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteContainer(c._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {selectedContainerId === c._id && (
              <div className="nested-items-wrapper">
                <ItemSection containerId={c._id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
