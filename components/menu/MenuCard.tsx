"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/data/menuItems";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const badgeColors: Record<string, string> = {
  Bestseller: "from-red-500 to-orange-500",
  "Chef's Pick": "from-purple-500 to-fuchsia-500",
  Spicy: "from-rose-600 to-red-500",
  New: "from-emerald-500 to-teal-500",
  Popular: "from-amber-500 to-yellow-400",
  "Must Try": "from-sky-500 to-indigo-500",
};

export default function MenuCard({ item, index }: MenuCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: "easeOut",
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-800/60 bg-stone-900/70 shadow-lg shadow-black/20 backdrop-blur transition-all duration-300 hover:border-amber-600/40 hover:shadow-amber-900/20"
    >
      {/* ── Image ────────────────────────────────── */}
      <div className="relative h-48 w-full overflow-hidden sm:h-52">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-800 text-5xl">
            🥟
          </div>
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />

        {/* Badge */}
        {item.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${
              badgeColors[item.badge] ?? "from-amber-500 to-orange-500"
            } px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg`}
          >
            {item.badge}
          </span>
        )}

        {/* Veg indicator */}
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-sm border-2 border-green-500 bg-stone-900/80">
          <span className="h-2 w-2 rounded-full bg-green-500" />
        </span>
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Category tag */}
        <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
          {item.category}
        </span>

        <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors duration-300">
          {item.name}
        </h3>

        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-stone-400">
          {item.description}
        </p>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-amber-400">
            {item.price}
          </span>

          <button
            type="button"
            className="relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md shadow-amber-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-700/40 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {/* shine effect */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}