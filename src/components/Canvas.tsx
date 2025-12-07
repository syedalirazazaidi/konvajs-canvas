import React, { useRef } from "react";
import { Stage, Layer, Rect, Circle, Group, Text, Line } from "react-konva";
import type { FurnitureItem } from "../types/floorPlan";
import { getDefaultColor } from "../utils/furnitureUtils";

interface CanvasProps {
  furniture: FurnitureItem[];
  selectedId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  onFurnitureChange: (furniture: FurnitureItem[]) => void;
  onSelectedIdChange: (id: string | null) => void;
  onStageDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onStageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  furniture,
  selectedId,
  canvasWidth,
  canvasHeight,
  onFurnitureChange,
  onSelectedIdChange,
  onStageDrop,
  onStageDragOver,
}) => {
  const stageRef = useRef<any>(null);

  const handleDragStart = (e: any) => {
    const id = e.target.id();
    onSelectedIdChange(id);
  };

  const handleDragEnd = (e: any) => {
    const id = e.target.id();
    const newX = e.target.x();
    const newY = e.target.y();

    onFurnitureChange(
      furniture.map((item) =>
        item.id === id ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelectedIdChange(null);
    }
  };

  const renderFurniture = (item: FurnitureItem) => {
    const isSelected = item.id === selectedId;

    switch (item.type) {
      case "wall-segment":
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
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#654321"}
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

      case "rectangle":
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
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#999"}
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

      case "pillar":
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
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Circle
              radius={item.width / 2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#999"}
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

      case "arm-chair":
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={5}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#2A2A2A"}
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

      case "round-table":
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
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Circle
              radius={item.width / 2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#654321"}
              strokeWidth={isSelected ? 3 : 2}
            />
            <Circle radius={item.width / 2 - 5} fill="#D2691E" />
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

      case "monitor":
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
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={2}
              fill={item.color || getDefaultColor(item.type)}
              stroke={isSelected ? "#00ff00" : "#000"}
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

      case "projector":
        return (
          <Group
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectedIdChange(item.id)}
          >
            <Rect
              width={item.width}
              height={item.height}
              cornerRadius={3}
              fill="#2a2a2a"
              stroke={isSelected ? "#00ff00" : "#1a1a1a"}
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
    <div
      className="canvas-container"
      onDrop={onStageDrop}
      onDragOver={onStageDragOver}
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
  );
};

export default Canvas;

