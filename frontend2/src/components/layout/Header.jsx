"use client"

import { useState } from 'react';
import { Search, Bell, User, Wifi, WifiOff } from 'lucide-react';
import { useOrderNotifications } from '../../context/OrderNotifications';

const Header = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { orders, connectionState, unreadCount, clearUnread } = useOrderNotifications();

  const toggleNotifications = () => {
    setNotificationsOpen((open) => !open);
    clearUnread();
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between h-16">
        {/* Restaurant Name */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold hidden md:block">Restaurant Dashboard</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <div className="relative">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={toggleNotifications}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">New orders</h2>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  {connectionState === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {connectionState === 'connected' ? 'Live' : connectionState === 'unauthorized' ? 'Sign in required' : connectionState}
                </span>
              </div>
              {orders.length === 0 ? (
                <p className="py-5 text-center text-sm text-gray-500">No new orders yet.</p>
              ) : (
                <ul className="max-h-80 space-y-2 overflow-y-auto">
                  {orders.slice(0, 8).map((order) => (
                    <li key={order.id} className="rounded-md bg-gray-50 p-2 text-sm">
                      <p className="font-medium">
                        Order #{order.orderNumber ?? order.id.slice(0, 8)} · Table {order.table?.tableNumber ?? '—'}
                      </p>
                      <p className="mt-1 text-gray-600">
                        {order.orderItems?.length ?? 0} items · ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;