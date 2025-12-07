import React, { useState } from "react";
import {
  Circle as CircleIcon,
  RectangleHorizontal,
  CircleDot,
  Armchair,
  Monitor,
  Projector,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { FurnitureItem } from "../types/floorPlan";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/fileUtils";

interface SidebarProps {
  floorPlanName: string;
  furniture: FurnitureItem[];
  selectedId: string | null;
  onFloorPlanNameChange: (name: string) => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  onFurnitureChange: (furniture: FurnitureItem[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  floorPlanName,
  furniture,
  selectedId,
  onFloorPlanNameChange,
  onDeleteSelected,
  onClearAll,
  onFurnitureChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragStart = (type: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", type);
  };

  const handleSaveToLocalStorage = () => {
    try {
      saveToLocalStorage(floorPlanName, furniture);
      alert("Floor plan saved to browser storage!");
    } catch (error) {
      alert("Error saving floor plan");
    }
  };

  const handleLoadFromLocalStorage = () => {
    try {
      const data = loadFromLocalStorage();
      if (data) {
        onFurnitureChange(data.furniture || []);
        if (data.name) {
          onFloorPlanNameChange(data.name);
        }
        alert("Floor plan loaded from browser storage!");
      } else {
        alert("No saved floor plan found");
      }
    } catch (error) {
      alert("Error loading floor plan");
    }
  };

  return (
    <div className="sidebar">
      <div
        className="sidebar-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2>Floor Plan Elements</h2>
        {/* {isExpanded ? (
          <ChevronUp size={20} color="#495057" />
        ) : (
          <ChevronDown size={20} color="#495057" />
        )} */}
      </div>

      {isExpanded && (
        <div className="sidebar-content">
          <div className="toolbar">
            <h3>Basic Shapes</h3>
            <div className="toolbar-items">
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("wall-segment")}
              >
                <div className="toolbar-icon">
                  <RectangleHorizontal
                    size={20}
                    color="#2c3e50"
                    strokeWidth={1.5}
                  />
                </div>
                <span>Wall Segr</span>
              </div>
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("pillar")}
              >
                <div className="toolbar-icon">
                  <CircleIcon size={20} color="#2c3e50" strokeWidth={1.5} />
                </div>
                <span>Pillar</span>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <h3>Furniture</h3>
            <div className="toolbar-items">
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("rectangle")}
              >
                <div className="toolbar-icon">
                  <RectangleHorizontal
                    size={20}
                    color="#2c3e50"
                    strokeWidth={1.5}
                  />
                </div>
                <span>Rectangle</span>
              </div>
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("round-table")}
              >
                <div className="toolbar-icon">
                  <CircleDot size={20} color="#2c3e50" />
                </div>
                <span>Round Table</span>
              </div>
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("arm-chair")}
              >
                <div className="toolbar-icon">
                  <Armchair size={20} color="#2c3e50" />
                </div>
                <span>Armchair</span>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <h3>Equipment</h3>
            <div className="toolbar-items">
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("monitor")}
              >
                <div className="toolbar-icon">
                  <Monitor size={20} color="#2c3e50" />
                </div>
                <span>Monitor C</span>
              </div>
              <div
                className="toolbar-item"
                draggable={true}
                onDragStart={handleDragStart("projector")}
              >
                <div className="toolbar-icon">
                  <Projector size={20} color="#2c3e50" />
                </div>
                <span>Projector</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="controls">
        <h3>Controls</h3>
        <div className="input-group">
          <input
            type="text"
            value={floorPlanName}
            onChange={(e) => onFloorPlanNameChange(e.target.value)}
            placeholder="Floor Plan Name"
            className="floor-plan-name-input"
          />
        </div>
        <button
          onClick={onDeleteSelected}
          disabled={!selectedId}
          className="delete-btn"
        >
          Delete Selected
        </button>
        <button onClick={onClearAll} className="clear-btn">
          Clear All
        </button>
      </div>

      <div className="save-load-section">
        <button
          onClick={handleSaveToLocalStorage}
          className="save-btn"
          disabled={furniture.length === 0}
        >
          Save to Browser
        </button>
        <button onClick={handleLoadFromLocalStorage} className="load-btn">
          Load from Browser
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

