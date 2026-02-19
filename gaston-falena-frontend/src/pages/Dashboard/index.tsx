import { useState } from "react";
import HouseSection from "../../components/HouseSection";
import ContainerSection from "../../components/ContainerSection";
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
      <div className="dashboard-column">
        <HouseSection
          selectedHouseId={selectedHouseId}
          onSelectHouse={handleSelectHouse}
        />
      </div>

      {selectedHouseId && (
        <div className="dashboard-column">
          <ContainerSection
            houseId={selectedHouseId}
            selectedContainerId={selectedContainerId}
            onSelectContainer={setSelectedContainerId}
          />
        </div>
      )}
    </div>
  );
}
