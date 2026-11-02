"use client";

import { Clock, CheckCircle, AlertCircle, Utensils } from "lucide-react";

export function ActivityTimeline() {
  const activities = [
    {
      time: "2 mins ago",
      action: "New order received",
      description: "Order #12350 from Table 3",
      icon: <Utensils className="h-5 w-5" />,
      status: "info",
    },
    {
      time: "10 mins ago",
      action: "Payment completed",
      description: "Order #12345 by John Doe",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      status: "success",
    },
    {
      time: "25 mins ago",
      action: "Payment failed",
      description: "Order #12348 by Emily Davis",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      status: "error",
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4">
            <div className="shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                {activity.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{activity.action}</h3>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}