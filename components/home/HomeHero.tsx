"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* ── Background layers ──────────────────── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-stone-950 to-amber-950/40" />
        <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-orange-600/10 blur-[140px]" />
        <div className="absolute -bottom-24 right-0 h-[350px] w-[450px] rounded-full bg-red-700/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-[250px] w-[350px] rounded-full bg-amber-700/8 blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-40 lg:pb-28">
        {/* ── Left — Text ─────────────────────── */}
        <div className="text-center lg:text-left">
          {/* top tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400 backdrop-blur"
          >
            <span className="text-sm">🔥</span>
            Delhi's Favourite Street Food
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-serif text-4xl font-bold leading-tight tracking-tight text-stone-50 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Delhi{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Tandoori
            </span>{" "}
            Momo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-4 font-serif text-lg italic text-amber-300/80 sm:text-xl"
          >
            &ldquo;Smoky. Spicy. Soul‑Warming.&rdquo;
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-stone-400 sm:text-lg lg:mx-0 mx-auto"
          >
            Handcrafted momos kissed by tandoori flames, loaded burgers,
            crunchy sandwiches and sizzling soya chaap — all born from
            Delhi&apos;s vibrant street‑food culture and made fresh for you,
            every single day.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center"
          >
            {/* Primary */}
            <Link
              href="/menu"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-700/40 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                View Menu
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
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start"
          >
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "8+", label: "Signature Dishes" },
              { value: "4.8", label: "Avg Rating ★" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-2xl font-extrabold tracking-tight text-amber-400">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs tracking-wide text-stone-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right — Visual ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* glow ring behind image */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-red-500/10 to-orange-500/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-stone-800/60 shadow-2xl shadow-black/30">
            <img
              src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=700&h=500&fit=crop&q=80"
              alt="Signature tandoori momos from Delhi Tandoori Momo"
              className="h-full w-full object-cover"
              loading="eager"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

            {/* floating badge */}
            <div className="absolute bottom-5 left-5 rounded-xl border border-stone-700/60 bg-stone-900/80 px-5 py-3 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
                Most Loved
              </p>
              <p className="mt-0.5 text-lg font-bold text-stone-100">
                Tandoori Momos
              </p>
              <p className="text-sm font-extrabold text-amber-400">₹120</p>
            </div>
          </div>

          {/* small decorative floating card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -right-3 -top-3 hidden rounded-2xl border border-stone-800/60 bg-stone-900/90 p-4 shadow-xl backdrop-blur sm:block"
          >
            <p className="text-2xl">🔥</p>
            <p className="mt-1 text-xs font-bold text-stone-300">
              Freshly Made
            </p>
            <p className="text-[10px] text-stone-500">Every day</p>
          </motion.div>
        </motion.div>
      </div>

      {/* decorative bottom border (same as menu hero) */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
    </section>
  );
}