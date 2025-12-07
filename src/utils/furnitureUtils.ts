import type { FurnitureType } from '../types/floorPlan';


export const getDimensions = (type: FurnitureType): { width: number; height: number } => {
  switch (type) {
    case 'wall-segment': return { width: 120, height: 20 };
    case 'pillar': return { width: 40, height: 40 };
    case 'rectangle': return { width: 80, height: 60 };
    case 'round-table': return { width: 70, height: 70 };
    case 'arm-chair': return { width: 50, height: 60 };
    case 'monitor': return { width: 50, height: 40 };
    case 'projector': return { width: 60, height: 40 };
    default: return { width: 60, height: 60 };
  }
};


export const getDefaultColor = (type: FurnitureType): string => {
  switch (type) {
    case 'wall-segment': return '#8B7355';
    case 'pillar': return '#E8E8E8';
    case 'rectangle': return '#E8E8E8';
    case 'round-table': return '#8B4513';
    case 'arm-chair': return '#4A4A4A';
    case 'monitor': return '#1a1a1a';
    case 'projector': return '#2a2a2a';
    default: return '#999999';
  }
};

