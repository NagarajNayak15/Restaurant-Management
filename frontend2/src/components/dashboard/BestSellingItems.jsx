"use client";

import { Star } from "lucide-react";

export function BestSellingItems() {
  const items = [
    {
      name: "Margherita Pizza",
      category: "Italian",
      orders: 120,
      revenue: 1800,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop",
    },
    {
      name: "Caesar Salad",
      category: "Salads",
      orders: 95,
      revenue: 950,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=64&h=64&fit=crop",
    },
    {
      name: "Spaghetti Carbonara",
      category: "Italian",
      orders: 80,
      revenue: 1200,
      image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=64&h=64&fit=crop",
    },
    {
      name: "Chocolate Lava Cake",
      category: "Desserts",
      orders: 60,
      revenue: 600,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=64&h=64&fit=crop",
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Best Selling Items</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-3 rounded-lg ${index === 0 ? "bg-secondary" : "hover:bg-secondary transition-colors"}`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                {index === 0 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.orders} orders</span>
                  <span>${item.revenue}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(item.orders / items[0].orders) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}