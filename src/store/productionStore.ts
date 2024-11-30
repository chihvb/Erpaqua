import { create } from 'zustand';
import { Production } from '../types';

interface ProductionState {
  productions: Production[];
  isLoading: boolean;
  error: string | null;
  addProduction: (production: Omit<Production, 'id'>) => void;
  updateProduction: (id: string, production: Partial<Production>) => void;
  deleteProduction: (id: string) => void;
}

export const useProductionStore = create<ProductionState>((set, get) => ({
  productions: [
    {
      id: '1',
      batchNumber: 'PB001',
      productId: '1',
      quantity: 5000,
      startDate: '2024-03-15',
      completionDate: '2024-03-16',
      status: 'in-progress',
    },
    {
      id: '2',
      batchNumber: 'PB002',
      productId: '2',
      quantity: 3000,
      startDate: '2024-03-14',
      completionDate: '2024-03-15',
      status: 'completed',
    },
  ],
  isLoading: false,
  error: null,

  addProduction: (production) => {
    const productions = get().productions;
    const newProduction = {
      ...production,
      id: (productions.length + 1).toString(),
    };
    set({ productions: [...productions, newProduction] });
  },

  updateProduction: (id, updatedProduction) => {
    const productions = get().productions;
    set({
      productions: productions.map((production) =>
        production.id === id ? { ...production, ...updatedProduction } : production
      ),
    });
  },

  deleteProduction: (id) => {
    const productions = get().productions;
    set({ productions: productions.filter((production) => production.id !== id) });
  },
}));