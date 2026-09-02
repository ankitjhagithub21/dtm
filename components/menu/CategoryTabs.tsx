"use client";

import React from "react";
import { motion } from "framer-motion";
import type { MenuCategory } from "@/data/menuItems";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: "All" | MenuCategory;
  onSelect: (cat: "All" | MenuCategory) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  const allTabs: ("All" | MenuCategory)[] = ["All", ...categories];

  // emoji map for visual flair
  const emoji: Record<string, string> = {
    All: "🍽️",
    Momos: "🥟",
    Sandwiches: "🥪",
    Burgers: "🍔",
    "Soya Chaap": "🍢",
  };

  return (
    <div
      id="menu"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
    >
      {allTabs.map((tab) => {
        const isActive = activeCategory === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isActive
                ? "text-stone-950"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="text-base">{emoji[tab]}</span>
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  );
}