export type FurnitureType = 
  | 'wall-segment' | 'pillar' 
  | 'rectangle' | 'round-table' | 'arm-chair'  
  | 'monitor' | 'projector'; 
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

