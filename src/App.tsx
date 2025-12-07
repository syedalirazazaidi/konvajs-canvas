import React, { useState, useRef } from "react";
import type { FurnitureType, FurnitureItem } from "./types/floorPlan";
import { getDimensions } from "./utils/furnitureUtils";
import {
  deleteItem,
  findItemById,
  updateItemProperty,
} from "./utils/itemUtils";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import "./App.css";

const App = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [floorPlanName, setFloorPlanName] = useState<string>("My Floor Plan");
  const nextIdRef = useRef(0);

  const sidebarWidth = 240;
  const propertiesPanelWidth = 280;
  const canvasWidth = window.innerWidth - sidebarWidth - propertiesPanelWidth;
  const canvasHeight = window.innerHeight - 20;

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const itemType = e.dataTransfer.getData("text/plain") as FurnitureType;
    const validTypes: FurnitureType[] = [
      "wall-segment",
      "pillar",
      "rectangle",
      "round-table",
      "arm-chair",
      "monitor",
      "projector",
    ];
    if (!itemType || !validTypes.includes(itemType)) {
      return;
    }

    const canvasContainer = e.currentTarget;
    const rect = canvasContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dimensions = getDimensions(itemType);
    const newItem: FurnitureItem = {
      id: `item-${nextIdRef.current++}`,
      type: itemType,
      x: x,
      y: y,
      width: dimensions.width,
      height: dimensions.height,
    };

    setFurniture((prev) => [...prev, newItem]);
  };

  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const deleteSelected = () => {
    if (selectedId) {
      setFurniture((prev) => deleteItem(prev, selectedId));
      setSelectedId(null);
    }
  };

  const selectedItem = findItemById(furniture, selectedId);

  const handleUpdateItemProperty = (
    property: keyof FurnitureItem,
    value: any
  ) => {
    if (!selectedId) return;
    setFurniture((prev) =>
      updateItemProperty(prev, selectedId, property, value)
    );
  };

  const handleClearAll = () => {
    setFurniture([]);
    setSelectedId(null);
  };

  return (
    <div className="app-container">
      <Sidebar
        floorPlanName={floorPlanName}
        furniture={furniture}
        selectedId={selectedId}
        onFloorPlanNameChange={setFloorPlanName}
        onDeleteSelected={deleteSelected}
        onClearAll={handleClearAll}
        onFurnitureChange={setFurniture}
      />
      <Canvas
        furniture={furniture}
        selectedId={selectedId}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onFurnitureChange={setFurniture}
        onSelectedIdChange={setSelectedId}
        onStageDrop={handleStageDrop}
        onStageDragOver={handleStageDragOver}
      />
      <PropertiesPanel
        selectedItem={selectedItem}
        onUpdateProperty={handleUpdateItemProperty}
      />
    </div>
  );
};

export default App;
