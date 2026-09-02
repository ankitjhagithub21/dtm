"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: "🍳",
    title: "Freshly Prepared",
    description:
      "Every dish is made to order — no reheating, no shortcuts. You taste the freshness in every single bite.",
  },
  {
    icon: "🔥",
    title: "Authentic Tandoori Flavour",
    description:
      "Our signature tandoori marinade and clay‑oven technique give each momo a smoky depth you won't find anywhere else.",
  },
  {
    icon: "🌿",
    title: "Quality Ingredients",
    description:
      "We source the finest spices, farm‑fresh vegetables and premium paneer so every plate is packed with real flavour.",
  },
  {
    icon: "🛵",
    title: "Delicious Street Food",
    description:
      "The bold, unapologetic taste of Delhi's streets — refined just enough for a sit‑down experience, raw enough to keep you hooked.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-700/5 blur-[120px]" />
      </div>

      {/* top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Us"
          title="Why Choose Delhi Tandoori Momo?"
          description="Four reasons thousands of food lovers trust us with their cravings."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative flex flex-col items-center rounded-2xl border border-stone-800/60 bg-stone-900/70 p-8 text-center shadow-lg shadow-black/20 backdrop-blur transition-all duration-300 hover:border-amber-600/40 hover:shadow-amber-900/20"
            >
              {/* icon circle */}
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/15 text-3xl ring-1 ring-amber-500/20 transition-all duration-300 group-hover:from-amber-500/25 group-hover:to-orange-500/25 group-hover:ring-amber-500/40">
                {b.icon}
              </div>

              <h3 className="text-lg font-bold text-stone-100 transition-colors duration-300 group-hover:text-amber-300">
                {b.title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-stone-400">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* bottom border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
    </section>
  );
}