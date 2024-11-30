import { create } from 'zustand';
import { Customer } from '../types';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [
    {
      id: '1',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '123-456-7890',
      address: '123 Business St',
      totalOrders: 15,
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'orders@techstart.com',
      phone: '098-765-4321',
      address: '456 Tech Ave',
      totalOrders: 8,
    },
  ],
  isLoading: false,
  error: null,

  addCustomer: (customer) => {
    const customers = get().customers;
    const newCustomer = {
      ...customer,
      id: (customers.length + 1).toString(),
    };
    set({ customers: [...customers, newCustomer] });
  },

  updateCustomer: (id, updatedCustomer) => {
    const customers = get().customers;
    set({
      customers: customers.map((customer) =>
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      ),
    });
  },

  deleteCustomer: (id) => {
    const customers = get().customers;
    set({ customers: customers.filter((customer) => customer.id !== id) });
  },
}));