export type FurnitureType = 
  | 'wall-segment' | 'pillar'  // Basic Shapes
  | 'rectangle' | 'round-table' | 'arm-chair'  // Furniture
  | 'monitor' | 'projector';  // Equipment

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
}

