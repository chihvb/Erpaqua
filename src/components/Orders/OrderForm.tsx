import React, { useState } from 'react';
import { Order, Product } from '../../types';
import { useProductStore } from '../../store/productStore';

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: Omit<Order, 'id'>) => void;
  onCancel: () => void;
}

export function OrderForm({ initialData, onSubmit, onCancel }: OrderFormProps) {
  const { products } = useProductStore();
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    products: initialData?.products || [],
    status: initialData?.status || 'pending',
    orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0],
    totalAmount: initialData?.totalAmount || 0,
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);

  const addProductToOrder = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newProducts = [
      ...formData.products,
      { productId: selectedProduct, quantity }
    ];

    const newTotalAmount = newProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);

    setFormData({
      ...formData,
      products: newProducts,
      totalAmount: newTotalAmount,
    });

    setSelectedProduct('');
    setQuantity(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Add Products</label>
        <div className="flex gap-2">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (${product.price})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addProductToOrder}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {formData.products.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
          <div className="space-y-2">
            {formData.products.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{product?.name}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-right">
            <span className="font-medium">Total: ${formData.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Order['status'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}