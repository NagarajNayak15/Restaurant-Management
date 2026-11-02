import { createContext, useContext } from "react";

export const OrderNotificationsContext = createContext(null);

export function useOrderNotifications() {
  const context = useContext(OrderNotificationsContext);
  if (!context) {
    throw new Error("useOrderNotifications must be used inside OrderNotificationsProvider");
  }
  return context;
}
