"use client";

import React from "react";
import HomeHero from "./HomeHero";
import FeaturedItems from "./FeaturedItems";
import WhyChooseUs from "./WhyChooseUs";
import AboutRestaurant from "./AboutRestaurant";
import CallToAction from "./CallToAction";
import Footer from "./Footer";

export default function HomePageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      <HomeHero />
      <FeaturedItems />
      <WhyChooseUs />
      <AboutRestaurant />
      <CallToAction />
      <Footer />
    </main>
  );
}