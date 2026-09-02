import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart | Delhi Tandoori Momo",
  description: "Review your Delhi Tandoori Momo order before placing it.",
};

export default function CartPage() {
  return <CartPageClient />;
}
