import { Metadata } from "next";
import MenuPageClient from "@/components/menu/MenuPageClient";
import { getMenuItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu | Delhi Tandoori Momo",
  description:
    "Explore our authentic tandoori momos, sandwiches, burgers and more at Delhi Tandoori Momo.",
};

export default async function MenuPage() {
  const items = await getMenuItems();
  return <MenuPageClient items={items} />;
}
