"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems, categories, MenuCategory } from "@/data/menuItems";
import HeroSection from "./HeroSection";
import CategoryTabs from "./CategoryTabs";
import MenuCard from "./MenuCard";

export default function MenuPageClient() {
  const [activeCategory, setActiveCategory] = useState<
    "All" | MenuCategory
  >("All");

  const filtered =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      {/* ── Hero ─────────────────────────────────── */}
      <HeroSection />

      {/* ── Menu Section ─────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* decorative spice line */}
        <div className="mx-auto mb-12 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
          <span className="font-serif text-sm uppercase tracking-[0.3em] text-amber-400">
            Our Menu
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500" />
        </div>

        {/* ── Tabs ──────────────────────────────── */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* ── Grid ──────────────────────────────── */}
        <motion.div
          layout
          className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center text-stone-500">
            No items in this category yet.
          </p>
        )}
      </section>

      {/* ── Footer accent ────────────────────────── */}
      <footer className="border-t border-stone-800 py-8 text-center text-xs tracking-widest text-stone-600">
        © {new Date().getFullYear()} Delhi Tandoori Momo — All rights
        reserved.
      </footer>
    </main>
  );
}