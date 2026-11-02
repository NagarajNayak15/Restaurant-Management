import { useMemo, useState } from "react";
import { BellRing, Check, CheckCheck, Clock3, LoaderCircle, Utensils, Wifi, WifiOff } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useOrderNotifications } from "../context/OrderNotifications";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(amount) || 0);

async function updateOrderRequest(path, token, options) {
  const response = await fetch(`${API_URL}/order${path}`, {
    ...options,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`);
  }

  if (!response.ok) throw new Error(data.message || `Order update failed (${response.status}).`);
  return data;
}

export default function Orders() {
  const { orders, connectionState, updateOrder } = useOrderNotifications();
  const [filter, setFilter] = useState("active");
  const [busyAction, setBusyAction] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredOrders = useMemo(
    () => orders.filter((order) => filter === "all" || (filter === "active" ? order.status !== "inactive" : order.status === "inactive")),
    [filter, orders],
  );
  const activeCount = orders.filter((order) => order.status !== "inactive").length;

  const markItemServed = async (order, item) => {
    const actionId = `${order.id}:${item.id}`;
    setBusyAction(actionId);
    setActionError("");
    setNotice("");

    try {
      const data = await updateOrderRequest(
        `/${encodeURIComponent(order.id)}/items/${encodeURIComponent(item.id)}/serve`,
        localStorage.getItem("ownerToken"),
        { method: "PATCH" },
      );
      updateOrder(order.id, (current) => ({
        orderItems: current.orderItems.map((currentItem) =>
          currentItem.id === data.item.id ? { ...currentItem, ...data.item } : currentItem),
      }));
      setNotice(`"${item.menuItem?.name || "Menu item"}" marked served.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyAction("");
    }
  };

  const completeOrder = async (order) => {
    setBusyAction(order.id);
    setActionError("");
    setNotice("");

    try {
      const data = await updateOrderRequest(
        `/${encodeURIComponent(order.id)}/status`,
        localStorage.getItem("ownerToken"),
        { method: "PUT", body: JSON.stringify({ status: "inactive" }) },
      );
      updateOrder(order.id, data.order);
      setNotice(`Order #${order.orderNumber ?? order.id.slice(0, 8)} completed. Table ${order.table?.tableNumber ?? ""} is available again.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyAction("");
    }
  };

  const connectionLabel = {
    connecting: "Connecting to live orders",
    connected: "Live order updates on",
    reconnecting: "Connection lost. Reconnecting…",
    unauthorized: "Owner authentication required",
  }[connectionState];

  return (
    <DashboardLayout activePage="Orders">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order management</h1>
            <p className="mt-1 text-gray-600">Mark individual items served and complete active orders.</p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
              connectionState === "connected"
                ? "bg-green-50 text-green-700"
                : connectionState === "unauthorized"
                  ? "bg-amber-50 text-amber-800"
                  : "bg-gray-100 text-gray-600"
            }`}
            role="status"
          >
            {connectionState === "connected" ? <Wifi size={16} /> : <WifiOff size={16} />}
            {connectionLabel}
          </div>
        </div>

        {connectionState === "unauthorized" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Sign in with an owner account to receive and manage orders.
          </div>
        )}
        {actionError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">{activeCount} active · {orders.length - activeCount} completed · {orders.length} total orders</p>
          <div className="flex gap-2" aria-label="Filter orders">
            {[
              { value: "active", label: `Active (${activeCount})` },
              { value: "completed", label: `Completed (${orders.length - activeCount})` },
              { value: "all", label: "All" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  filter === option.value ? "bg-orange-500 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <BellRing className="mx-auto h-8 w-8 text-gray-400" />
            <h2 className="mt-4 font-semibold text-gray-900">
              {orders.length === 0 ? "Waiting for orders" : "No orders in this filter"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {orders.length === 0
                ? "Previous orders will appear here, and new orders arrive while the dashboard is connected."
                : "Choose another filter to view the order history."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isCompleted = order.status === "inactive";
              const isBusy = busyAction === order.id;

              return (
                <article key={order.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Order #{order.orderNumber ?? order.id.slice(0, 8)}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.customer?.name || "Guest"} · Table {order.table?.tableNumber ?? "—"}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                      isCompleted ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-700"
                    }`}>
                      {isCompleted ? "Completed" : order.status || "Active"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    {(order.orderItems || []).map((item) => {
                      const actionId = `${order.id}:${item.id}`;
                      return (
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm" key={item.id}>
                          <span className="flex items-center gap-2 text-gray-700">
                            <Utensils className="h-4 w-4 shrink-0 text-gray-400" />
                            {item.menuItem?.name || "Menu item"} × {item.quantity}
                            {item.notes && <span className="text-gray-500">· {item.notes}</span>}
                          </span>
                          <span className="ml-auto flex items-center gap-3">
                            <span className="text-gray-600">{formatCurrency(item.totalPrice)}</span>
                            {item.isServed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                <Check size={14} /> Served
                              </span>
                            ) : !isCompleted ? (
                              <button
                                type="button"
                                onClick={() => markItemServed(order, item)}
                                disabled={busyAction === actionId || isBusy}
                                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                {busyAction === actionId && <LoaderCircle size={13} className="animate-spin" />}
                                Mark served
                              </button>
                            ) : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock3 className="h-4 w-4" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Just now"}
                      {order.orderType && <span className="capitalize">· {order.orderType}</span>}
                      {order.paymentMode && <span className="capitalize">· {order.paymentMode}</span>}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">Total {formatCurrency(order.totalAmount)}</span>
                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => completeOrder(order)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy ? <LoaderCircle size={16} className="animate-spin" /> : <CheckCheck size={16} />}
                          Complete order
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
