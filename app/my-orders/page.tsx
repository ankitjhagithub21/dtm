import type { Metadata } from "next";
import MyOrdersClient from "@/components/orders/MyOrdersClient";
export const metadata: Metadata = { title: "My Orders | Delhi Tandoori Momo" };
export default function MyOrdersPage() { return <MyOrdersClient />; }
