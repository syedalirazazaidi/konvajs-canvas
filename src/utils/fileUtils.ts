import type { FurnitureItem } from '../types/floorPlan';

export interface FloorPlanMetadata {
  createdAt: string;
  canvasWidth: number;
  canvasHeight: number;
}

export interface FloorPlanData {
  name: string;
  furniture: FurnitureItem[];
  metadata?: FloorPlanMetadata;
}


export const saveAsJSON = (
  name: string,
  furniture: FurnitureItem[],
  canvasWidth: number,
  canvasHeight: number
): void => {
  const floorPlanData: FloorPlanData = {
    name,
    furniture,
    metadata: {
      createdAt: new Date().toISOString(),
      canvasWidth,
      canvasHeight,
    },
  };

  const jsonString = JSON.stringify(floorPlanData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const loadFromJSON = (
  file: File,
  onSuccess: (data: FloorPlanData) => void,
  onError: (error: string) => void
): void => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target?.result as string) as FloorPlanData;
      if (jsonData.furniture && Array.isArray(jsonData.furniture)) {
        onSuccess(jsonData);
      } else {
        onError('Invalid floor plan file format');
      }
    } catch (error) {
      console.error('Error loading JSON:', error);
      onError('Error loading floor plan file');
    }
  };
  reader.readAsText(file);
};


export const saveToLocalStorage = (
  name: string,
  furniture: FurnitureItem[]
): void => {
  try {
    const floorPlanData: FloorPlanData = {
      name,
      furniture,
      metadata: {
        createdAt: new Date().toISOString(),
        canvasWidth: 0,
        canvasHeight: 0,
      },
    };
    localStorage.setItem('floorPlan', JSON.stringify(floorPlanData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Error saving floor plan');
  }
};


export const loadFromLocalStorage = (): FloorPlanData | null => {
  try {
    const data = localStorage.getItem('floorPlan');
    if (data) {
      return JSON.parse(data) as FloorPlanData;
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    throw new Error('Error loading floor plan');
  }
};


export const copyJSONToClipboard = (
  name: string,
  furniture: FurnitureItem[],
  canvasWidth: number,
  canvasHeight: number
): Promise<void> => {
  const floorPlanData: FloorPlanData = {
    name,
    furniture,
    metadata: {
      createdAt: new Date().toISOString(),
      canvasWidth,
      canvasHeight,
    },
  };
  const jsonData = JSON.stringify(floorPlanData, null, 2);
  return navigator.clipboard.writeText(jsonData);
};

