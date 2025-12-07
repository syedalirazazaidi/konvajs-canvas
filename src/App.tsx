import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Line } from 'react-konva';
import { 
  Circle as CircleIcon, 
  RectangleHorizontal, 
  CircleDot, 
  Armchair, 
  Monitor, 
  Projector 
} from 'lucide-react';
import type { FurnitureType, FurnitureItem } from './types/floorPlan';
import { getDimensions, getDefaultColor } from './utils/furnitureUtils';
import { saveAsJSON, loadFromJSON, saveToLocalStorage, loadFromLocalStorage, copyJSONToClipboard } from './utils/fileUtils';
import { updateItemProperty, deleteItem, findItemById } from './utils/itemUtils';
import './App.css';

const App = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [floorPlanName, setFloorPlanName] = useState<string>('My Floor Plan');
  const stageRef = useRef<any>(null);
  const nextIdRef = useRef(0);

  const sidebarWidth = 240;
  const propertiesPanelWidth = 280;
  const canvasWidth = window.innerWidth - sidebarWidth - propertiesPanelWidth;
  const canvasHeight = window.innerHeight - 20;

  const handleDragStart = (e: any) => {
    const id = e.target.id();
    setSelectedId(id);
  };

  const handleDragEnd = (e: any) => {
    const id = e.target.id();
    const newX = e.target.x();
    const newY = e.target.y();

    setFurniture((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemType = e.dataTransfer.getData('text/plain') as FurnitureType;
    const validTypes: FurnitureType[] = [
      'wall-segment', 'pillar',
      'rectangle', 'round-table', 'arm-chair',
      'monitor', 'projector'
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

  // Save floor plan as JSON file
  const handleSaveAsJSON = () => {
    saveAsJSON(floorPlanName, furniture, canvasWidth, canvasHeight);
  };

  // Load floor plan from JSON file
  const handleLoadFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    loadFromJSON(
      file,
      (data) => {
        setFurniture(data.furniture);
        if (data.name) {
          setFloorPlanName(data.name);
        }
        setSelectedId(null);
        alert('Floor plan loaded successfully!');
      },
      (error) => {
        alert(error);
      }
    );
    // Reset input so same file can be loaded again
    event.target.value = '';
  };

  // Save to localStorage
  const handleSaveToLocalStorage = () => {
    try {
      saveToLocalStorage(floorPlanName, furniture);
      alert('Floor plan saved to browser storage!');
    } catch (error) {
      alert('Error saving floor plan');
    }
  };

  // Load from localStorage
  const handleLoadFromLocalStorage = () => {
    try {
      const data = loadFromLocalStorage();
      if (data) {
        setFurniture(data.furniture || []);
        if (data.name) {
          setFloorPlanName(data.name);
        }
        setSelectedId(null);
        alert('Floor plan loaded from browser storage!');
      } else {
        alert('No saved floor plan found');
      }
    } catch (error) {
      alert('Error loading floor plan');
    }
  };

  // Copy JSON to clipboard
  const handleCopyJSONToClipboard = () => {
    copyJSONToClipboard(floorPlanName, furniture, canvasWidth, canvasHeight)
      .then(() => {
        alert('JSON data copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        alert('Error copying to clipboard');
      });
  };

  // Get selected item
  const selectedItem = findItemById(furniture, selectedId);

  // Update item properties
  const handleUpdateItemProperty = (property: keyof FurnitureItem, value: any) => {
    if (!selectedId) return;
    setFurniture((prev) => updateItemProperty(prev, selectedId, property, value));
  };

  const renderFurniture = (item: FurnitureItem) => {
    const isSelected = item.id === selectedId;

    switch (item.type) {
      case 'wall-segment':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation || 0}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#654321'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Line
              points={[0, item.height / 2, item.width, item.height / 2]}
              stroke="#654321"
              strokeWidth={1}
            />
            <Text
              text={item.name || "Wall"}
              fontSize={10}
              fill="white"
              x={item.width / 2 - 15}
              y={item.height / 2 - 6}
              visible={isSelected}
            />
          </Group>
        );

      case 'rectangle':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation || 0}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#999'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Text
              text={item.name || "Rectangle"}
              fontSize={10}
              fill="#333"
              x={item.width / 2 - 30}
              y={item.height / 2 - 6}
              visible={isSelected}
            />
          </Group>
        );

      case 'pillar':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation || 0}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Circle
              radius={item.width / 2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#999'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Text
              text="Pillar"
              fontSize={10}
              fill="#333"
              x={-20}
              y={-6}
              visible={isSelected}
            />
          </Group>
        );

      case 'arm-chair':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={5}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#2A2A2A'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Rect
              x={5}
              y={5}
              width={item.width - 10}
              height={item.height - 15}
              cornerRadius={3}
              fill="#6A6A6A"
            />
            <Rect
              x={item.width - 15}
              y={item.height - 15}
              width={10}
              height={10}
              fill="#5A5A5A"
            />
            <Text
              text={item.name || "Arm Chair"}
              fontSize={9}
              fill="white"
              x={item.width / 2 - 25}
              y={item.height / 2 - 5}
              visible={isSelected}
            />
          </Group>
        );

      case 'round-table':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation || 0}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Circle
              radius={item.width / 2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#654321'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Circle
              radius={item.width / 2 - 5}
              fill="#D2691E"
            />
            <Text
              text={item.name || "Round Table"}
              fontSize={9}
              fill="white"
              x={-30}
              y={-6}
              visible={isSelected}
            />
          </Group>
        );

      case 'monitor':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation || 0}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? '#00ff00' : '#000'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Rect
              x={2}
              y={2}
              width={item.width - 4}
              height={item.height - 8}
              fill="#2a2a2a"
            />
            <Rect
              x={item.width / 2 - 8}
              y={item.height - 6}
              width={16}
              height={4}
              fill="#3a3a3a"
            />
            <Text
              text="Monitor"
              fontSize={9}
              fill="white"
              x={item.width / 2 - 20}
              y={item.height / 2 - 5}
              visible={isSelected}
            />
          </Group>
        );

      case 'projector':
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={3}
              fill="#2a2a2a"
              stroke={isSelected ? '#00ff00' : '#1a1a1a'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Circle
              x={item.width / 2}
              y={item.height / 2}
              radius={8}
              fill="#1a1a1a"
            />
            <Circle
              x={item.width / 2}
              y={item.height / 2}
              radius={5}
              fill="#4a4a4a"
            />
            <Text
              text="Projector"
              fontSize={9}
              fill="white"
              x={item.width / 2 - 25}
              y={item.height + 5}
              visible={isSelected}
            />
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Floor Plan Elements</h2>
        
        {/* Basic Shapes Section */}
        <div className="toolbar">
          <h3>Basic Shapes</h3>
          <div className="toolbar-items">
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'wall-segment');
              }}
            >
              <div className="toolbar-icon">
                <RectangleHorizontal size={20} color="#2c3e50" strokeWidth={1.5} />
              </div>
              <span>Wall Segr</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'pillar');
              }}
            >
              <div className="toolbar-icon">
                <CircleIcon size={20} color="#2c3e50" strokeWidth={1.5} />
              </div>
              <span>Pillar</span>
            </div>
          </div>
        </div>

        {/* Furniture Section */}
        <div className="toolbar">
          <h3>Furniture</h3>
          <div className="toolbar-items">
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'rectangle');
              }}
            >
              <div className="toolbar-icon">
                <RectangleHorizontal size={20} color="#2c3e50" strokeWidth={1.5} />
              </div>
              <span>Rectangle</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'round-table');
              }}
            >
              <div className="toolbar-icon">
                <CircleDot size={20} color="#2c3e50" />
              </div>
              <span>Round Table</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'arm-chair');
              }}
            >
              <div className="toolbar-icon">
                <Armchair size={20} color="#2c3e50" />
              </div>
              <span>Armchair</span>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="toolbar">
          <h3>Equipment</h3>
          <div className="toolbar-items">
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'monitor');
              }}
            >
              <div className="toolbar-icon">
                <Monitor size={20} color="#2c3e50" />
              </div>
              <span>Monitor C</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'projector');
              }}
            >
              <div className="toolbar-icon">
                <Projector size={20} color="#2c3e50" />
              </div>
              <span>Projector</span>
            </div>
          </div>
        </div>

        <div className="controls">
          <h3>Controls</h3>
          <div className="input-group">
            <input
              type="text"
              value={floorPlanName}
              onChange={(e) => setFloorPlanName(e.target.value)}
              placeholder="Floor Plan Name"
              className="floor-plan-name-input"
            />
          </div>
          <button
            onClick={deleteSelected}
            disabled={!selectedId}
            className="delete-btn"
          >
            Delete Selected
          </button>
          <button
            onClick={() => {
              setFurniture([]);
              setSelectedId(null);
            }}
            className="clear-btn"
          >
            Clear All
          </button>
        </div>

        <div className="save-load-section">
          <h3>Save & Load</h3>
          <button
            onClick={handleSaveAsJSON}
            className="save-btn"
            disabled={furniture.length === 0}
          >
            Save as JSON File
          </button>
          <label className="load-btn-label">
            <input
              type="file"
              accept=".json"
              onChange={handleLoadFromJSON}
              style={{ display: 'none' }}
            />
            <span className="load-btn">Load from JSON File</span>
          </label>
          <button
            onClick={handleSaveToLocalStorage}
            className="save-btn"
            disabled={furniture.length === 0}
          >
            Save to Browser
          </button>
          <button
            onClick={handleLoadFromLocalStorage}
            className="load-btn"
          >
            Load from Browser
          </button>
          <button
            onClick={handleCopyJSONToClipboard}
            className="copy-btn"
            disabled={furniture.length === 0}
          >
            Copy JSON to Clipboard
          </button>
        </div>
        {/* <div className="info">
          <p>• Drag items from sidebar to canvas</p>
          <p>• Click items to select</p>
          <p>• Drag items on canvas to move</p>
          <p>• Delete selected items</p>
        </div> */}
      </div>
      <div 
        className="canvas-container"
        onDrop={handleStageDrop}
        onDragOver={handleStageDragOver}
      >
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
          ref={stageRef}
        >
          <Layer>
            {/* Grid background */}
            {Array.from({ length: Math.ceil(canvasWidth / 20) }).map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 20, 0, i * 20, canvasHeight]}
                stroke="#e0e0e0"
                strokeWidth={0.5}
              />
            ))}
            {Array.from({ length: Math.ceil(canvasHeight / 20) }).map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 20, canvasWidth, i * 20]}
                stroke="#e0e0e0"
                strokeWidth={0.5}
              />
            ))}
            {furniture.map(renderFurniture)}
          </Layer>
        </Stage>
      </div>
      
      {/* Properties Panel */}
      <div className="properties-panel">
        <h2>Element Properties</h2>
        {selectedItem ? (
          <div className="properties-content">
            <div className="property-group">
              <label>Name</label>
              <input
                type="text"
                value={selectedItem.name || `${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1).replace('-', ' ')}`}
                onChange={(e) => handleUpdateItemProperty('name', e.target.value)}
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
                    onChange={(e) => handleUpdateItemProperty('width', parseFloat(e.target.value) || 0)}
                    className="property-input"
                    min="1"
                  />
                </div>
                <div className="dimension-input">
                  <label>Height (px)</label>
                  <input
                    type="number"
                    value={selectedItem.height}
                    onChange={(e) => handleUpdateItemProperty('height', parseFloat(e.target.value) || 0)}
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
                onChange={(e) => handleUpdateItemProperty('rotation', parseFloat(e.target.value))}
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
                  onChange={(e) => handleUpdateItemProperty('color', e.target.value)}
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
    </div>
  );
};

export default App;
