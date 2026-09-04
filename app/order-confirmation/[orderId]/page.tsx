import type { Metadata } from "next";
import OrderConfirmationClient from "@/components/checkout/OrderConfirmationClient";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Order ${orderId} | Delhi Tandoori Momo`,
    description: "Your Delhi Tandoori Momo order has been confirmed.",
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;

  return <OrderConfirmationClient orderId={orderId} />;
}
