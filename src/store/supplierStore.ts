import { create } from 'zustand';
import { Supplier } from '../types';

interface SupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [
    {
      id: '1',
      name: 'Bottle Co.',
      email: 'orders@bottleco.com',
      phone: '111-222-3333',
      address: '789 Industrial Park',
      materials: ['PET Bottles', 'Caps', 'Labels'],
    },
    {
      id: '2',
      name: 'Package Solutions',
      email: 'sales@packagesolutions.com',
      phone: '444-555-6666',
      address: '321 Packaging Rd',
      materials: ['Boxes', 'Shrink Wrap', 'Pallets'],
    },
  ],
  isLoading: false,
  error: null,

  addSupplier: (supplier) => {
    const suppliers = get().suppliers;
    const newSupplier = {
      ...supplier,
      id: (suppliers.length + 1).toString(),
    };
    set({ suppliers: [...suppliers, newSupplier] });
  },

  updateSupplier: (id, updatedSupplier) => {
    const suppliers = get().suppliers;
    set({
      suppliers: suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      ),
    });
  },

  deleteSupplier: (id) => {
    const suppliers = get().suppliers;
    set({ suppliers: suppliers.filter((supplier) => supplier.id !== id) });
  },
}));