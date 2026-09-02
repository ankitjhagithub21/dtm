import { Metadata } from "next";
import MenuPageClient from "@/components/menu/MenuPageClient";

export const metadata: Metadata = {
  title: "Menu | Delhi Tandoori Momo",
  description:
    "Explore our authentic tandoori momos, sandwiches, burgers and more at Delhi Tandoori Momo.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}