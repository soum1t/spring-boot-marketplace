import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("marketplace_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("marketplace_cart", JSON.stringify(newItems));
  };

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          next = [...prev, { id: Date.now(), product, quantity }];
        }
        localStorage.setItem("marketplace_cart", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const removeItem = useCallback(
    (cartItemId: number) => {
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== cartItemId);
        localStorage.setItem("marketplace_cart", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (cartItemId: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }
      setItems((prev) => {
        const next = prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        localStorage.setItem("marketplace_cart", JSON.stringify(next));
        return next;
      });
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
