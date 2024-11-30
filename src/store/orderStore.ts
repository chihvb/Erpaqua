import { create } from 'zustand';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [
    {
      id: '1',
      customerName: 'Acme Corp',
      products: [
        { productId: '1', quantity: 100 },
        { productId: '2', quantity: 50 },
      ],
      status: 'pending',
      orderDate: '2024-03-15',
      totalAmount: 249.50,
    },
    {
      id: '2',
      customerName: 'TechStart Inc',
      products: [
        { productId: '2', quantity: 200 },
        { productId: '3', quantity: 20 },
      ],
      status: 'processing',
      orderDate: '2024-03-14',
      totalAmount: 779.80,
    },
  ],
  isLoading: false,
  error: null,

  addOrder: (order) => {
    const orders = get().orders;
    const newOrder = {
      ...order,
      id: (orders.length + 1).toString(),
    };
    set({ orders: [...orders, newOrder] });
  },

  updateOrder: (id, updatedOrder) => {
    const orders = get().orders;
    set({
      orders: orders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      ),
    });
  },

  deleteOrder: (id) => {
    const orders = get().orders;
    set({ orders: orders.filter((order) => order.id !== id) });
  },
}));