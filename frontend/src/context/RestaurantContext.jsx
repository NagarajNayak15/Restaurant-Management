import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RestaurantContext = createContext(null);

const loadCartFromStorage = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load cart from storage:", error);
    return [];
  }
};

const formatCategoryName = (category) => {
  if (!category) return "All";

  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function RestaurantProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dietFilter, setDietFilter] = useState("all");
  const [cart, setCart] = useState(loadCartFromStorage);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/menu");
        if (!response.ok) {
          throw new Error(`Menu request failed with status ${response.status}`);
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.warn("Failed to fetch menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.warn("Failed to save cart to storage:", error);
    }
  }, [cart]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(menuItems.map((item) => item.category).filter(Boolean))];

    return [
      { label: "All", value: "All" },
      ...uniqueCategories.map((category) => ({
        label: formatCategoryName(category),
        value: category,
      })),
    ];
  }, [menuItems]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);

      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }

      return [...prev, { id: item.id, qty: 1 }];
    });
  };

  const removeFromCart = (id, removeAll = false) => {
    setCart((prev) => {
      if (removeAll) {
        return prev.filter((c) => c.id !== id);
      }

      return prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0);
    });
  };

  const getItemQty = (id) => {
    return cart.find((c) => c.id === id)?.qty || 0;
  };

  const cartItems = useMemo(() => {
    return cart
      .map(({ id, qty }) => {
        const item = menuItems.find((menuItem) => menuItem.id === id);
        return item ? { ...item, qty } : null;
      })
      .filter(Boolean);
  }, [cart, menuItems]);

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cartItems.reduce((sum, c) => sum + Number(c.price || 0) * c.qty, 0);

  const filteredMenu = useMemo(() => {
    let items = menuItems;

    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (dietFilter === "veg") {
      items = items.filter((item) => item.non_veg === false);
    } else if (dietFilter === "nonveg") {
      items = items.filter((item) => item.non_veg === true);
    }

    return items;
  }, [activeCategory, dietFilter, menuItems]);

  const [tableNumber] = useState(12);

  return (
    <RestaurantContext.Provider
      value={{
        allItems: menuItems,
        filteredMenu,
        categories,
        activeCategory,
        setActiveCategory,
        dietFilter,
        setDietFilter,
        cart,
        cartItems,
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
    throw new Error("useRestaurant must be used inside RestaurantProvider");
  }

  return ctx;
}