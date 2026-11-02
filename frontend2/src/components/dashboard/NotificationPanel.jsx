"use client";

import { Bell, CheckCircle, AlertCircle } from "lucide-react";

export function NotificationPanel() {
  const notifications = [
    {
      message: "New order received from Table 3",
      time: "2 mins ago",
      read: false,
      type: "info",
    },
    {
      message: "Payment completed for Order #12345",
      time: "10 mins ago",
      read: true,
      type: "success",
    },
    {
      message: "Payment failed for Order #12348",
      time: "25 mins ago",
      read: false,
      type: "error",
    },
  ];

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Notifications</h3>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-2 rounded-lg ${!notification.read ? "bg-secondary" : "hover:bg-secondary transition-colors"}`}
          >
            <div className="flex-shrink-0 mt-1">
              {notification.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : notification.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Bell className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}