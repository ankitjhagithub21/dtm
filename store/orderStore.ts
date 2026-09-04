"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NewOrderDetails, OrderDetails, OrderStore } from "@/types/order";

const createOrderId = () => {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `DTM-${datePart}-${suffix}`;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      currentOrder: null,
      placeOrder: (order: NewOrderDetails) => {
        const confirmedOrder: OrderDetails = {
          ...order,
          orderId: createOrderId(),
          status: "confirmed",
          createdAt: new Date().toISOString(),
          estimatedTime: "30–40 minutes",
        };

        set((state) => ({
          orders: [confirmedOrder, ...state.orders],
          currentOrder: confirmedOrder,
        }));

        return confirmedOrder;
      },
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: "delhi-tandoori-momo-orders",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder,
      }),
    },
  ),
);
