import type { FurnitureItem } from '../types/floorPlan';


export const updateItemProperty = (
  items: FurnitureItem[],
  itemId: string,
  property: keyof FurnitureItem,
  value: any
): FurnitureItem[] => {
  return items.map((item) =>
    item.id === itemId ? { ...item, [property]: value } : item
  );
};


export const deleteItem = (
  items: FurnitureItem[],
  itemId: string
): FurnitureItem[] => {
  return items.filter((item) => item.id !== itemId);
};


export const findItemById = (
  items: FurnitureItem[],
  itemId: string | null
): FurnitureItem | undefined => {
  if (!itemId) return undefined;
  return items.find((item) => item.id === itemId);
};

