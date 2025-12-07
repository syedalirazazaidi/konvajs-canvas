import React, { useRef } from "react";
import { Stage, Layer, Rect, Group, Text, Line } from "react-konva";
import {
  Circle as CircleIcon,
  RectangleHorizontal,
  CircleDot,
  Armchair,
  Monitor,
  Projector,
} from "lucide-react";
import type { FurnitureItem } from "../types/floorPlan";
import IconImage from "./IconImage";

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
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={RectangleHorizontal}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text={item.name || "Wall"}
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 15}
                y={item.height + 5}
              />
            )}
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
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={RectangleHorizontal}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text={item.name || "Rectangle"}
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 30}
                y={item.height + 5}
              />
            )}
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
            <Rect
              width={item.width}
              height={item.height}
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={CircleIcon}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text="Pillar"
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 20}
                y={item.height + 5}
              />
            )}
          </Group>
        );

      case "arm-chair":
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
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={Armchair}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text={item.name || "Arm Chair"}
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 25}
                y={item.height + 5}
              />
            )}
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
            <Rect
              width={item.width}
              height={item.height}
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={CircleDot}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text={item.name || "Round Table"}
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 30}
                y={item.height + 5}
              />
            )}
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
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={Monitor}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text="Monitor"
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 20}
                y={item.height + 5}
              />
            )}
          </Group>
        );

      case "projector":
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
              fill="transparent"
              stroke={isSelected ? "#00ff00" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
            />
            <IconImage
              IconComponent={Projector}
              x={0}
              y={0}
              width={item.width}
              height={item.height}
              color={item.color || "#2c3e50"}
            />
            {isSelected && (
              <Text
                text="Projector"
                fontSize={9}
                fill="#333"
                x={item.width / 2 - 25}
                y={item.height + 5}
              />
            )}
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

