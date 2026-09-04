import type { Metadata } from "next";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Delhi Tandoori Momo",
  description: "Complete your Delhi Tandoori Momo order securely.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
