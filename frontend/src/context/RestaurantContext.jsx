import { createContext, useContext, useMemo, useState } from "react";
import { menuItems as allItems } from "../data/menuData";

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  // Cart
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);

      if (existing) {
        return prev.map((c) =>
          c.id === item.id
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === id
            ? { ...c, qty: c.qty - 1 }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const getItemQty = (id) => {
    return cart.find((c) => c.id === id)?.qty || 0;
  };

  const cartCount = cart.reduce(
    (sum, c) => sum + c.qty,
    0
  );

  const cartTotal = cart.reduce(
    (sum, c) => sum + c.price * c.qty,
    0
  );

  // Category
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu = useMemo(() => {
    if (activeCategory === "All") {
      return allItems;
    }

    return allItems.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  // Table
  const [tableNumber] = useState(12);

  return (
    <RestaurantContext.Provider
      value={{
        allItems,
        filteredMenu,

        activeCategory,
        setActiveCategory,

        cart,
        addToCart,
        removeFromCart,
        getItemQty,
        cartCount,
        cartTotal,

        tableNumber,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);

  if (!ctx) {
    throw new Error(
      "useRestaurant must be used inside RestaurantProvider"
    );
  }

  return ctx;
}