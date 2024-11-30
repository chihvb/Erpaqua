import React from 'react';
import { Stats } from '../components/Dashboard/Stats';
import { ProductionOverview } from '../components/Dashboard/ProductionOverview';
import { InventoryStatus } from '../components/Dashboard/InventoryStatus';
import { RecentOrders } from '../components/Dashboard/RecentOrders';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <Stats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionOverview />
        <InventoryStatus />
      </div>
      <RecentOrders />
    </div>
  );
}