import React from 'react';
import { Package } from 'lucide-react';

export function InventoryStatus() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Inventory Status</h3>
        <Package className="h-5 w-5 text-blue-500" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">500ml Bottles</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
              <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-semibold">75%</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">1L Bottles</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
              <div className="w-1/2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-semibold">50%</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">5L Containers</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
              <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-semibold">25%</p>
        </div>
      </div>
    </div>
  );
}