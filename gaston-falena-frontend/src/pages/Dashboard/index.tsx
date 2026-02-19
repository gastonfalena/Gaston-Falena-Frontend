import { useState } from "react";
import HouseSection from "../../components/HouseSection";
import ContainerSection from "../../components/ContainerSection";
import ItemSection from "../../components/ItemSection";
import "./Dashboard.css";

export default function Dashboard() {
  const [selectedHouseId, setSelectedHouseId] = useState<string>("");
  const [selectedContainerId, setSelectedContainerId] = useState<string>("");

  const handleSelectHouse = (id: string) => {
    setSelectedHouseId(id);
    setSelectedContainerId("");
  };

  return (
    <div className="dashboard-container">
      {/* 1. SECCIÓN CASAS */}
      <HouseSection
        selectedHouseId={selectedHouseId}
        onSelectHouse={handleSelectHouse}
      />

      {selectedHouseId && (
        <ContainerSection
          houseId={selectedHouseId}
          selectedContainerId={selectedContainerId}
          onSelectContainer={setSelectedContainerId}
        />
      )}

      {selectedContainerId && <ItemSection containerId={selectedContainerId} />}
    </div>
  );
}
