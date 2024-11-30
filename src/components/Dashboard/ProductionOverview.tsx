import React from 'react';
import { Activity } from 'lucide-react';

export function ProductionOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Production Overview</h3>
        <Activity className="h-5 w-5 text-blue-500" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Active Batches</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Completed Today</p>
          <p className="text-2xl font-bold text-green-600">8</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Quality Checks</p>
          <p className="text-2xl font-bold text-yellow-600">4</p>
        </div>
      </div>
    </div>
  );
}