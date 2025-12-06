import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Line } from 'react-konva';
import { 
  Minus, 
  RectangleHorizontal, 
  Circle as CircleIcon, 
  Armchair, 
  CircleDot, 
  Square, 
  Monitor, 
  Projector 
} from 'lucide-react';
import './App.css';

type FurnitureType = 
  | 'wall-segment' | 'rectangle' | 'circle'  // Basic Shape
  | 'arm-chair' | 'round-table' | 'square-table'  // Furniture
  | 'monitor' | 'projector';  // Equipment

interface FurnitureItem {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

const App = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const nextIdRef = useRef(0);

  const canvasWidth = window.innerWidth - 250;
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
      'wall-segment', 'rectangle', 'circle',
      'arm-chair', 'round-table', 'square-table',
      'monitor', 'projector'
    ];
    if (!itemType || !validTypes.includes(itemType)) {
      return;
    }

    const canvasContainer = e.currentTarget;
    const rect = canvasContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Default dimensions for each item type
    const getDimensions = (type: FurnitureType) => {
      switch (type) {
        case 'wall-segment': return { width: 120, height: 20 };
        case 'rectangle': return { width: 80, height: 60 };
        case 'circle': return { width: 60, height: 60 };
        case 'arm-chair': return { width: 50, height: 60 };
        case 'round-table': return { width: 70, height: 70 };
        case 'square-table': return { width: 70, height: 70 };
        case 'monitor': return { width: 50, height: 40 };
        case 'projector': return { width: 60, height: 40 };
        default: return { width: 60, height: 60 };
      }
    };

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
      setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    }
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
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill="#8B7355"
              stroke={isSelected ? '#00ff00' : '#654321'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Line
              points={[0, item.height / 2, item.width, item.height / 2]}
              stroke="#654321"
              strokeWidth={1}
            />
            <Text
              text="Wall"
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
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill="#E8E8E8"
              stroke={isSelected ? '#00ff00' : '#999'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Text
              text="Rectangle"
              fontSize={10}
              fill="#333"
              x={item.width / 2 - 30}
              y={item.height / 2 - 6}
              visible={isSelected}
            />
          </Group>
        );

      case 'circle':
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
            <Circle
              radius={item.width / 2}
              fill="#E8E8E8"
              stroke={isSelected ? '#00ff00' : '#999'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Text
              text="Circle"
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
              fill="#4A4A4A"
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
              text="Arm Chair"
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
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Circle
              radius={item.width / 2}
              fill="#8B4513"
              stroke={isSelected ? '#00ff00' : '#654321'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Circle
              radius={item.width / 2 - 5}
              fill="#D2691E"
            />
            <Text
              text="Round Table"
              fontSize={9}
              fill="white"
              x={-30}
              y={-6}
              visible={isSelected}
            />
          </Group>
        );

      case 'square-table':
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
              fill="#8B4513"
              stroke={isSelected ? '#00ff00' : '#654321'}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Rect
              x={5}
              y={5}
              width={item.width - 10}
              height={item.height - 10}
              fill="#D2691E"
            />
            <Text
              text="Square Table"
              fontSize={9}
              fill="white"
              x={item.width / 2 - 35}
              y={item.height / 2 - 5}
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
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={2}
              fill="#1a1a1a"
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
        <h2>Floor Plan Designer</h2>
        
        {/* Basic Shape Section */}
        <div className="toolbar">
          <h3>Basic Shape</h3>
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
                <Minus size={24} color="#2c3e50" />
              </div>
              <span>Wall Segment</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'rectangle');
              }}
            >
              <div className="toolbar-icon">
                <RectangleHorizontal size={24} color="#2c3e50" />
              </div>
              <span>Rectangle</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'circle');
              }}
            >
              <div className="toolbar-icon">
                <CircleIcon size={24} color="#2c3e50" />
              </div>
              <span>Circle</span>
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
                e.dataTransfer.setData('text/plain', 'arm-chair');
              }}
            >
              <div className="toolbar-icon">
                <Armchair size={24} color="#2c3e50" />
              </div>
              <span>Arm Chair</span>
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
                <CircleDot size={24} color="#2c3e50" />
              </div>
              <span>Round Table</span>
            </div>
            <div
              className="toolbar-item"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', 'square-table');
              }}
            >
              <div className="toolbar-icon">
                <Square size={24} color="#2c3e50" />
              </div>
              <span>Square Table</span>
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
                <Monitor size={24} color="#2c3e50" />
              </div>
              <span>Monitor</span>
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
                <Projector size={24} color="#2c3e50" />
              </div>
              <span>Projector</span>
            </div>
          </div>
        </div>

        <div className="controls">
          <h3>Controls</h3>
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
        <div className="info">
          <p>• Drag items from sidebar to canvas</p>
          <p>• Click items to select</p>
          <p>• Drag items on canvas to move</p>
          <p>• Delete selected items</p>
        </div>
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
    </div>
  );
};

export default App;
