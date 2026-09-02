import { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Delhi Tandoori Momo — Authentic Tandoori Momos & Street Food",
  description:
    "Experience the fiery spirit of Delhi's street kitchens. Handcrafted tandoori momos, burgers, sandwiches and more — made fresh, served with soul.",
};

export default function HomePage() {
  return <HomePageClient />;
}