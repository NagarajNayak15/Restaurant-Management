"use client";

import { OrderCard } from "./OrderCard";

export function OrdersSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Orders</h2>
      <div className="space-y-3">
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </div>
    </div>
  );
}