"use client";

import React from "react";
import HomeHero from "./HomeHero";
import FeaturedItems from "./FeaturedItems";
import WhyChooseUs from "./WhyChooseUs";
import AboutRestaurant from "./AboutRestaurant";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import type { MenuItem } from "@/data/menuItems";

interface HomePageClientProps {
  items: MenuItem[];
}

export default function HomePageClient({ items }: HomePageClientProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      <HomeHero />
      <FeaturedItems items={items} />
      <WhyChooseUs />
      <AboutRestaurant />
      <CallToAction />
      <Footer />
    </main>
  );
}
