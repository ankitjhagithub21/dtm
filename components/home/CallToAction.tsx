"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden">
      {/* top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />

      {/* background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[350px] w-[500px] rounded-full bg-red-700/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[450px] rounded-full bg-amber-600/8 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-stone-800/60 bg-stone-900/50 px-6 py-14 shadow-2xl shadow-black/20 backdrop-blur sm:px-12 sm:py-16"
        >
          <span className="mb-4 inline-block text-5xl">🔥</span>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl lg:text-5xl">
            Craving Something{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Delicious
            </span>
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
            Explore our menu and discover your new favourite momo. From smoky
            tandoori to creamy Afgani — there&apos;s a perfect bite waiting for
            you.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary */}
            <Link
              href="/menu"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-700/40 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                Explore Menu
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
              </span>
            </Link>

            {/* Secondary */}
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3.5 text-sm font-semibold text-amber-300 backdrop-blur transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Order Now
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}