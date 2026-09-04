"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MenuItem } from "@/data/menuItems";
import MenuCard from "@/components/menu/MenuCard";
import SectionHeading from "./SectionHeading";

const featuredIds = [
  "tandoori-momos",
  "afgani-momos",
  "achari-momos",
  "paneer-burger",
  "paneer-sandwich",
  "soya-chaap",
];

interface FeaturedItemsProps {
  items: MenuItem[];
}

export default function FeaturedItems({ items }: FeaturedItemsProps) {
  const featured = featuredIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is MenuItem => item !== undefined);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        label="Fan Favourites"
        title="Our Popular Dishes"
        description="The ones everyone keeps coming back for — smoky, spicy and impossible to resist."
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* View Full Menu CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-14 text-center"
      >
        <Link
          href="/menu"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-700/40 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">View Full Menu</span>
          <svg
            className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}
