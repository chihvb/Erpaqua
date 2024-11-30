import { create } from 'zustand';
import { Inventory } from '../types';

interface InventoryState {
  inventory: Inventory[];
  isLoading: boolean;
  error: string | null;
  addInventory: (inventory: Omit<Inventory, 'id'>) => void;
  updateInventory: (id: string, inventory: Partial<Inventory>) => void;
  deleteInventory: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [
    {
      id: '1',
      productId: '1',
      quantity: 1500,
      location: 'Warehouse A',
      lastUpdated: '2024-03-15',
    },
    {
      id: '2',
      productId: '2',
      quantity: 1200,
      location: 'Warehouse B',
      lastUpdated: '2024-03-15',
    },
  ],
  isLoading: false,
  error: null,

  addInventory: (inventory) => {
    const inventoryItems = get().inventory;
    const newInventory = {
      ...inventory,
      id: (inventoryItems.length + 1).toString(),
    };
    set({ inventory: [...inventoryItems, newInventory] });
  },

  updateInventory: (id, updatedInventory) => {
    const inventory = get().inventory;
    set({
      inventory: inventory.map((item) =>
        item.id === id ? { ...item, ...updatedInventory } : item
      ),
    });
  },

  deleteInventory: (id) => {
    const inventory = get().inventory;
    set({ inventory: inventory.filter((item) => item.id !== id) });
  },
}));