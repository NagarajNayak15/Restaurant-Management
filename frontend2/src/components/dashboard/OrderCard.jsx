"use client";

import { Clock, Users, Utensils } from "lucide-react";

export function OrderCard() {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #12345</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Table 5
            </span>
            <span className="flex items-center">
              <Utensils className="h-3 w-3 mr-1" />
              3 Items
            </span>
          </div>
        </div>
        <span className="badge bg-green-100 text-green-800">Completed</span>
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">John Doe</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-medium">$45.00</p>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            10 mins ago
          </span>
        </div>
      </div>
    </div>
  );
}