"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-stone-950 to-amber-950/40" />
        <div className="absolute -top-24 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 h-[300px] w-[400px] rounded-full bg-red-700/10 blur-[100px]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-24 text-center sm:pt-32 lg:pt-40">
        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 h-px w-20 origin-center bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-amber-400/90"
        >
          Authentic • Smoky • Soul‑Warming
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight text-stone-50 sm:text-6xl lg:text-7xl"
        >
          Delhi{" "}
          <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
            Tandoori
          </span>{" "}
          Momo
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg"
        >
          Where the fiery spirit of Delhi's street kitchens meets the art of
          handcrafted momos. Every bite tells a story of smoke, spice and
          tradition.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#menu"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-7 py-3 text-sm font-semibold text-amber-300 backdrop-blur transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200"
        >
          Explore Menu
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.a>
      </div>

      {/* Decorative bottom border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
    </section>
  );
}