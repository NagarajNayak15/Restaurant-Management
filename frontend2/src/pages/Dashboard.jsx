import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, ChefHat, LoaderCircle, ShoppingBag, Table2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useOrderNotifications } from "../context/OrderNotifications";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

async function fetchResource(path, token) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: token } : {},
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status}).`);
  }

  return response.json();
}

function SummaryCard({ title, value, detail, icon: Icon, href }) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className="rounded-lg bg-orange-50 p-2 text-orange-600"><Icon size={20} /></span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{detail}</p>
    </>
  );

  return href ? (
    <Link to={href} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow">
      {content}
    </Link>
  ) : (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">{content}</section>
  );
}

const Dashboard = () => {
  const { orders, connectionState } = useOrderNotifications();
  const [tables, setTables] = useState(null);
  const [menuItems, setMenuItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("ownerToken");

    const loadDashboardData = async () => {
      const [tableResult, menuResult] = await Promise.allSettled([
        fetchResource("/table", token),
        fetchResource("/menu", token),
      ]);

      if (cancelled) return;

      const nextErrors = [];
      if (tableResult.status === "fulfilled" && Array.isArray(tableResult.value)) {
        setTables(tableResult.value);
      } else {
        nextErrors.push(tableResult.status === "rejected" ? `Tables: ${tableResult.reason.message}` : "Tables: invalid response from server.");
      }

      if (menuResult.status === "fulfilled" && Array.isArray(menuResult.value)) {
        setMenuItems(menuResult.value);
      } else {
        nextErrors.push(menuResult.status === "rejected" ? `Menu: ${menuResult.reason.message}` : "Menu: invalid response from server.");
      }

      setErrors(nextErrors);
      setIsLoading(false);
    };

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeTableCount = useMemo(
    () => tables?.filter((table) => table.isActive).length ?? null,
    [tables],
  );
  const activeOrderCount = useMemo(
    () => tables?.reduce((count, table) => count + (table.orders?.length ?? 0), 0) ?? null,
    [tables],
  );

  return (
    <DashboardLayout activePage="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">A live overview of your restaurant.</p>
        </div>

        {errors.map((error) => (
          <p key={error} role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle size={18} />{error}
          </p>
        ))}

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
            <LoaderCircle size={18} className="animate-spin" />Loading restaurant data...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total orders"
              value={orders.length}
              detail={connectionState === "connected" ? "Order history and live updates" : `Order stream ${connectionState}`}
              icon={ShoppingBag}
              href="/orders"
            />
            <SummaryCard
              title="Active orders at tables"
              value={activeOrderCount ?? "—"}
              detail={tables ? "From current table status" : "Table data unavailable"}
              icon={ChefHat}
              href="/tables"
            />
            <SummaryCard
              title="Active tables"
              value={activeTableCount ?? "—"}
              detail={tables ? `${tables.length} tables configured` : "Table data unavailable"}
              icon={Table2}
              href="/tables"
            />
            <SummaryCard
              title="Available menu items"
              value={menuItems ? menuItems.filter((item) => item.isAvailable).length : "—"}
              detail={menuItems ? `${menuItems.length} menu items configured` : "Menu data unavailable"}
              icon={Utensils}
              href="/menu"
            />
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-gray-900">Recent orders</h2>
                <p className="mt-1 text-xs text-gray-500">Most recent orders from your history and live updates.</p>
              </div>
              <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
                View orders <ArrowRight size={15} />
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-500">
                {connectionState === "connected" ? "Waiting for new orders." : `Order stream ${connectionState}.`}
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        Order #{order.orderNumber ?? order.id.slice(0, 8)} · Table {order.table?.tableNumber ?? "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {order.customer?.name || "Guest"} · {order.orderItems?.length ?? 0} items
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">{currency.format(Number(order.totalAmount) || 0)}</p>
                      <p className="text-xs capitalize text-gray-500">{order.status || "New"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-gray-900">Tables</h2>
                <p className="mt-1 text-xs text-gray-500">Current status from the restaurant table list.</p>
              </div>
              <Link to="/tables" className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
                Manage tables <ArrowRight size={15} />
              </Link>
            </div>
            {tables === null ? (
              <p className="px-5 py-10 text-center text-sm text-gray-500">Table information is unavailable.</p>
            ) : tables.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-500">No tables are configured.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
                {tables.slice(0, 6).map((table) => (
                  <div key={table.id} className="rounded-lg border border-gray-200 p-3">
                    <p className="font-medium text-gray-900">Table {table.tableNumber}</p>
                    <p className={`mt-1 text-xs ${table.isActive ? "text-green-700" : "text-gray-500"}`}>
                      {table.isActive ? "Active" : "Inactive"}
                      {table.orders?.length ? ` · ${table.orders.length} active orders` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
