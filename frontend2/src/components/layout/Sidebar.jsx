"use client"

import { useState } from 'react';
import { Home, Utensils, ShoppingCart, Users, Table2, Settings, Menu, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Menu Management', path: '/menu', icon: Utensils },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Tables', path: '/tables', icon: Table2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, activePage }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileDrawerOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
          {!isCollapsed && <span className="font-bold text-lg">Restaurant</span>}
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activePage === item.name ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Button */}
        <button
          className="p-4 border-t border-gray-200 w-full flex justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* User Profile */}
        <div className={`p-4 border-t border-gray-200 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;