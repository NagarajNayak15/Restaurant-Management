"use client";

import { TableCard } from "./TableCard";

export function TablesSection() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tables Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TableCard />
        <TableCard />
        <TableCard />
        <TableCard />
        <TableCard />
        <TableCard />
      </div>
    </div>
  );
}