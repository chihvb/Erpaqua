import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Factory, 
  Boxes,
  Users,
  Settings,
  BarChart,
  Truck,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Factory, label: 'Production', path: '/production' },
  { icon: Boxes, label: 'Inventory', path: '/inventory' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Truck, label: 'Suppliers', path: '/suppliers' },
  { icon: BarChart, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Package className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold">AquaERP</h1>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-800 cursor-pointer mb-1 ${
                isActive ? 'bg-gray-800' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-800 cursor-pointer mt-auto text-red-400"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}