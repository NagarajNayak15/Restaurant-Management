"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line } from "recharts";

export function StatCard() {
  const data = [
    { value: 10 },
    { value: 20 },
    { value: 15 },
    { value: 30 },
    { value: 25 },
    { value: 40 },
  ];

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold">$12,345</h3>
            <span className="text-sm font-medium text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12%
            </span>
          </div>
        </div>
        <div className="p-2 bg-secondary rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      </div>
      <div className="mt-4">
        <LineChart width={80} height={32} data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </div>
    </div>
  );
}