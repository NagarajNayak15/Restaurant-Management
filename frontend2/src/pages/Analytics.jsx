import { useMemo } from "react";
import { BarChart3, CircleDollarSign, ShoppingBag, Utensils } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useOrderNotifications } from "../context/OrderNotifications";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

function Metric({ label, value, detail, icon: Icon }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="rounded-lg bg-orange-50 p-2 text-orange-600"><Icon size={20} /></span>
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </section>
  );
}

export default function Analytics() {
  const { orders, connectionState } = useOrderNotifications();

  const { orderValue, averageOrderValue, dailyOrders, bestSellers, totalItems } = useMemo(() => {
    const orderValue = orders.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0);
    const groupedDays = new Map();
    const groupedItems = new Map();

    for (const order of orders) {
      const date = new Date(order.createdAt);
      if (!Number.isNaN(date.getTime())) {
        const key = date.toISOString().slice(0, 10);
        const day = groupedDays.get(key) ?? {
          date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          orders: 0,
          orderValue: 0,
        };
        day.orders += 1;
        day.orderValue += Number(order.totalAmount) || 0;
        groupedDays.set(key, day);
      }

      for (const item of order.orderItems ?? []) {
        const name = item.menuItem?.name || "Menu item";
        const current = groupedItems.get(name) ?? { name, quantity: 0, orderValue: 0 };
        current.quantity += Number(item.quantity) || 0;
        current.orderValue += Number(item.totalPrice) || 0;
        groupedItems.set(name, current);
      }
    }

    return {
      orderValue,
      averageOrderValue: orders.length ? orderValue / orders.length : 0,
      dailyOrders: [...groupedDays.entries()].sort(([first], [second]) => first.localeCompare(second)).map(([, day]) => day),
      bestSellers: [...groupedItems.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      totalItems: [...groupedItems.values()].reduce((total, item) => total + item.quantity, 0),
    };
  }, [orders]);
  const maximumDailyOrders = Math.max(1, ...dailyOrders.map((day) => day.orders));

  return (
    <DashboardLayout activePage="Analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">A summary of all orders in your order history.</p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          These figures include all historical orders and update as new orders arrive. Order stream: {connectionState}.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total orders" value={orders.length} detail="Historical and live orders" icon={ShoppingBag} />
          <Metric label="Order value" value={currency.format(orderValue)} detail="Sum of all order totals" icon={CircleDollarSign} />
          <Metric label="Average order value" value={currency.format(averageOrderValue)} detail="All order totals ÷ orders" icon={BarChart3} />
          <Metric label="Items ordered" value={totalItems} detail="Across all historical orders" icon={Utensils} />
        </div>

        {orders.length === 0 ? (
          <section className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <BarChart3 className="mx-auto h-9 w-9 text-gray-400" />
            <h2 className="mt-4 font-semibold text-gray-900">No order data yet</h2>
            <p className="mt-1 text-sm text-gray-500">Orders will appear here once they are placed.</p>
          </section>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">Orders received by day</h2>
              <p className="mt-1 text-xs text-gray-500">Includes historical orders and live updates.</p>
              {dailyOrders.length ? (
                <div className="mt-5 flex h-72 items-end gap-3 overflow-x-auto border-b border-l border-gray-200 px-4 pb-0 pt-5">
                  {dailyOrders.map((day) => (
                    <div key={day.date} title={`${day.orders} orders · ${currency.format(day.orderValue)} order value`} className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-xs font-medium text-gray-600">{day.orders}</span>
                      <div
                        className="w-full max-w-16 rounded-t-md bg-orange-500"
                        style={{ height: `${Math.max(8, (day.orders / maximumDailyOrders) * 78)}%` }}
                      />
                      <span className="whitespace-nowrap pb-2 text-xs text-gray-500">{day.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-sm text-gray-500">No dated orders to display.</p>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">Most ordered items</h2>
              <p className="mt-1 text-xs text-gray-500">Ranked by quantity across all orders.</p>
              {bestSellers.length ? (
                <ul className="mt-5 divide-y divide-gray-100">
                  {bestSellers.map((item, index) => (
                    <li key={item.name} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-orange-700">{index + 1}</span>
                        <span className="truncate text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-gray-900">{item.quantity} ordered</p>
                        <p className="text-xs text-gray-500">{currency.format(item.orderValue)} order value</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-16 text-center text-sm text-gray-500">No item details were included with these orders.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
