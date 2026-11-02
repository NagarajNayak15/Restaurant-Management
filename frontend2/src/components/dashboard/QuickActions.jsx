"use client";

import { Plus, Table, Utensils, Users, CreditCard } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Menu Item",
      icon: <Utensils className="h-6 w-6" />,
    },
    {
      title: "Create Table",
      icon: <Table className="h-6 w-6" />,
    },
    {
      title: "Manage Staff",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Process Payment",
      icon: <CreditCard className="h-6 w-6" />,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className="card p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-3 bg-secondary rounded-lg">{action.icon}</div>
            <span className="text-sm font-medium">{action.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}