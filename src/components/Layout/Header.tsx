import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Header() {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 bg-white border-b fixed top-0 right-0 left-64 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}