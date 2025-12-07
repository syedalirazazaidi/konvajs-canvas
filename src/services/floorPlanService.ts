// Service for saving and loading floor plans from database
import type { FurnitureItem } from '../types/floorPlan';

export interface FloorPlanData {
  id?: string;
  name: string;
  furniture: FurnitureItem[];
  createdAt?: string;
  updatedAt?: string;
}

// API Base URL - Update this with your backend URL
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Save floor plan to database
 */
export const saveFloorPlan = async (
  name: string,
  furniture: FloorPlanData['furniture']
): Promise<FloorPlanData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        furniture,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save floor plan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving floor plan:', error);
    throw error;
  }
};

/**
 * Update existing floor plan
 */
export const updateFloorPlan = async (
  id: string,
  name: string,
  furniture: FloorPlanData['furniture']
): Promise<FloorPlanData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        furniture,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update floor plan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating floor plan:', error);
    throw error;
  }
};

/**
 * Load floor plan from database
 */
export const loadFloorPlan = async (id: string): Promise<FloorPlanData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to load floor plan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading floor plan:', error);
    throw error;
  }
};

/**
 * Get all floor plans
 */
export const getAllFloorPlans = async (): Promise<FloorPlanData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-plans`);

    if (!response.ok) {
      throw new Error(`Failed to fetch floor plans: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching floor plans:', error);
    throw error;
  }
};

/**
 * Delete floor plan
 */
export const deleteFloorPlan = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete floor plan: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting floor plan:', error);
    throw error;
  }
};

/**
 * Save to localStorage as backup (for development/testing)
 */
export const saveToLocalStorage = (name: string, furniture: FloorPlanData['furniture']): void => {
  try {
    const data: FloorPlanData = {
      name,
      furniture,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`floor-plan-${name}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load from localStorage
 */
export const loadFromLocalStorage = (name: string): FloorPlanData | null => {
  try {
    const data = localStorage.getItem(`floor-plan-${name}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Get all floor plans from localStorage
 */
export const getAllFromLocalStorage = (): FloorPlanData[] => {
  try {
    const floorPlans: FloorPlanData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('floor-plan-')) {
        const data = localStorage.getItem(key);
        if (data) {
          floorPlans.push(JSON.parse(data));
        }
      }
    }
    return floorPlans;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

