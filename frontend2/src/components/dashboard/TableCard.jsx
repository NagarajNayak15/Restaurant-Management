"use client";

import { Users, CreditCard } from "lucide-react";

export function TableCard() {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Table 5</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Users className="h-3 w-3" />
            <span>4 / 6</span>
          </div>
        </div>
        <span className="badge bg-green-100 text-green-800">Occupied</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          <span>$45.00</span>
        </div>
      </div>
    </div>
  );
}