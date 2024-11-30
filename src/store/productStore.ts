import { create } from 'zustand';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [
    {
      id: '1',
      name: 'Pure Spring Water 500ml',
      size: 500,
      price: 1.99,
      stock: 1500,
      batchNumber: 'B001',
    },
    {
      id: '2',
      name: 'Pure Spring Water 1L',
      size: 1000,
      price: 2.99,
      stock: 1200,
      batchNumber: 'B002',
    },
    {
      id: '3',
      name: 'Pure Spring Water 5L',
      size: 5000,
      price: 8.99,
      stock: 500,
      batchNumber: 'B003',
    },
  ],
  isLoading: false,
  error: null,

  addProduct: (product) => {
    const products = get().products;
    const newProduct = {
      ...product,
      id: (products.length + 1).toString(),
    };
    set({ products: [...products, newProduct] });
  },

  updateProduct: (id, updatedProduct) => {
    const products = get().products;
    set({
      products: products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    });
  },

  deleteProduct: (id) => {
    const products = get().products;
    set({ products: products.filter((product) => product.id !== id) });
  },
}));