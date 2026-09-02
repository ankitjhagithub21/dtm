"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartStore } from "@/types/cart";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(({ id }) => id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, 20) }
                  : cartItem,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item,
          ),
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (item.id !== id) return [item];
            if (item.quantity === 1) return [];
            return [{ ...item, quantity: item.quantity - 1 }];
          }),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      subtotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "delhi-tandoori-momo-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
