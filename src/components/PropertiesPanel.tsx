import React from 'react';
import type { FurnitureItem } from '../types/floorPlan';
import { getDefaultColor } from '../utils/furnitureUtils';

interface PropertiesPanelProps {
  selectedItem: FurnitureItem | undefined;
  onUpdateProperty: (property: keyof FurnitureItem, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedItem,
  onUpdateProperty,
}) => {
  return (
    <div className="properties-panel">
      <h2>Element Properties</h2>
      {selectedItem ? (
        <div className="properties-content">
          <div className="property-group">
            <label>Name</label>
            <input
              type="text"
              value={selectedItem.name || `${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1).replace('-', ' ')}`}
              onChange={(e) => onUpdateProperty('name', e.target.value)}
              className="property-input"
              placeholder="Enter name"
            />
          </div>

          <div className="property-group">
            <label>Dimensions</label>
            <div className="dimensions-row">
              <div className="dimension-input">
                <label>Width (px)</label>
                <input
                  type="number"
                  value={selectedItem.width}
                  onChange={(e) => onUpdateProperty('width', parseFloat(e.target.value) || 0)}
                  className="property-input"
                  min="1"
                />
              </div>
              <div className="dimension-input">
                <label>Height (px)</label>
                <input
                  type="number"
                  value={selectedItem.height}
                  onChange={(e) => onUpdateProperty('height', parseFloat(e.target.value) || 0)}
                  className="property-input"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="property-group">
            <label>Rotation ({selectedItem.rotation || 0}°)</label>
            <input
              type="range"
              min="0"
              max="360"
              value={selectedItem.rotation || 0}
              onChange={(e) => onUpdateProperty('rotation', parseFloat(e.target.value))}
              className="rotation-slider"
              style={{
                '--slider-progress': `${((selectedItem.rotation || 0) / 360) * 100}%`
              } as React.CSSProperties}
            />
          </div>

          <div className="property-group">
            <label>Color</label>
            <input
              type="color"
              value={selectedItem.color || getDefaultColor(selectedItem.type)}
              onChange={(e) => onUpdateProperty('color', e.target.value)}
              className="color-picker"
            />
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <p>Select an element to edit its properties</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;

