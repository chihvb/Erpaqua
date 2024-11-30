import React from 'react';
import { DollarSign, Package, Truck, Users } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Active Orders',
      value: '45',
      change: '+8.2%',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'New Customers',
      value: '12',
      change: '+2.4%',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Pending Deliveries',
      value: '18',
      change: '-4.1%',
      icon: Truck,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
          <p className="text-gray-600">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}