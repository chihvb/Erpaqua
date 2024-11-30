export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

export interface Product {
  id: string;
  name: string;
  size: number;
  price: number;
  stock: number;
  batchNumber: string;
}

export interface Order {
  id: string;
  customerName: string;
  products: Array<{productId: string; quantity: number}>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
  totalAmount: number;
}

export interface Production {
  id: string;
  batchNumber: string;
  productId: string;
  quantity: number;
  startDate: string;
  completionDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'quality-check';
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  materials: string[];
}