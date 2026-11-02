import { useCallback, useEffect, useState } from "react";
import { OrderNotificationsContext } from "../../context/OrderNotifications";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const parseEvent = (frame) => {
  let eventName = "message";
  const data = [];

  for (const line of frame.split(/\r?\n/)) {
    if (line.startsWith("event:")) eventName = line.slice(6).trim();
    if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }

  return { eventName, data: data.join("\n") };
};

export function OrderNotificationsProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [connectionState, setConnectionState] = useState(() =>
    localStorage.getItem("ownerToken") ? "connecting" : "unauthorized",
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const ownerToken = localStorage.getItem("ownerToken");
    if (!ownerToken) return undefined;

    const controller = new AbortController();
    let stopped = false;
    let retryTimeout;
    let ordersLoaded = false;

    const loadOrderHistory = async () => {
      const response = await fetch(`${API_URL}/order`, {
        headers: { Authorization: ownerToken },
        signal: controller.signal,
      });

      if (response.status === 401 || response.status === 403) {
        setConnectionState("unauthorized");
        return false;
      }

      if (!response.ok) {
        throw new Error(`Order history request failed (${response.status}).`);
      }

      const history = await response.json();
      if (!Array.isArray(history)) {
        throw new Error("Order history response was invalid.");
      }

      setOrders((currentOrders) => {
        const ordersById = new Map(history.map((order) => [order.id, order]));
        currentOrders.forEach((order) => ordersById.set(order.id, order));
        return [...ordersById.values()].sort(
          (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
        );
      });
      return true;
    };

    const connect = async () => {
      while (!stopped) {
        try {
          if (!ordersLoaded) {
            const historyLoaded = await loadOrderHistory();
            if (!historyLoaded) return;
            ordersLoaded = true;
          }

          const response = await fetch(`${API_URL}/order/events`, {
            headers: {
              Accept: "text/event-stream",
              Authorization: ownerToken,
            },
            signal: controller.signal,
          });

          if (response.status === 401 || response.status === 403) {
            setConnectionState("unauthorized");
            return;
          }
          if (!response.ok || !response.body) {
            throw new Error(`Order stream request failed (${response.status})`);
          }

          setConnectionState("connected");
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (!stopped) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let frameEnd = buffer.indexOf("\n\n");
            while (frameEnd !== -1) {
              const frame = buffer.slice(0, frameEnd);
              buffer = buffer.slice(frameEnd + 2);
              const { eventName, data } = parseEvent(frame);

              if (eventName === "new-order" && data) {
                try {
                  const order = JSON.parse(data);
                  setOrders((currentOrders) =>
                    [order, ...currentOrders.filter((current) => current.id !== order.id)],
                  );
                  setUnreadCount((count) => count + 1);
                } catch (error) {
                  console.error("Could not read new order event", error);
                }
              }

              frameEnd = buffer.indexOf("\n\n");
            }
          }

          if (!stopped) throw new Error("Order event stream disconnected");
        } catch (error) {
          if (stopped || error.name === "AbortError") return;
          console.error("Order event stream disconnected", error);
          setConnectionState("reconnecting");
        }

        await new Promise((resolve) => {
          retryTimeout = window.setTimeout(resolve, 3000);
        });
      }
    };

    connect();

    return () => {
      stopped = true;
      controller.abort();
      window.clearTimeout(retryTimeout);
    };
  }, []);

  const clearUnread = useCallback(() => setUnreadCount(0), []);
  const updateOrder = useCallback((orderId, update) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => order.id === orderId
        ? { ...order, ...(typeof update === "function" ? update(order) : update) }
        : order),
    );
  }, []);

  return (
    <OrderNotificationsContext.Provider
      value={{ orders, connectionState, unreadCount, clearUnread, updateOrder }}
    >
      {children}
    </OrderNotificationsContext.Provider>
  );
}
