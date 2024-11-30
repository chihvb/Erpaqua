import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function RecentOrders() {
  const orders = [
    { id: '1', customer: 'Acme Corp', amount: 2500, status: 'pending' },
    { id: '2', customer: 'TechStart Inc', amount: 1800, status: 'processing' },
    { id: '3', customer: 'Global Foods', amount: 3200, status: 'shipped' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <ShoppingCart className="h-5 w-5 text-blue-500" />
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.amount}</p>
              <span className={`text-sm px-2 py-1 rounded-full ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}