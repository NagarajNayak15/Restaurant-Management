"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueChart() {
  const data = [
    { name: "00:00", revenue: 1200 },
    { name: "03:00", revenue: 800 },
    { name: "06:00", revenue: 1500 },
    { name: "09:00", revenue: 2200 },
    { name: "12:00", revenue: 3000 },
    { name: "15:00", revenue: 2800 },
    { name: "18:00", revenue: 3500 },
    { name: "21:00", revenue: 4000 },
  ];

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Revenue Analytics</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm rounded-lg bg-secondary text-secondary-foreground">Today</button>
          <button className="px-3 py-1 text-sm rounded-lg text-muted-foreground hover:bg-secondary">Week</button>
          <button className="px-3 py-1 text-sm rounded-lg text-muted-foreground hover:bg-secondary">Month</button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}