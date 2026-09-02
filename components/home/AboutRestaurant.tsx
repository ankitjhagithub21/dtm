"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function AboutRestaurant() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── Image side ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-500/15 via-red-500/10 to-orange-500/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-stone-800/60 shadow-2xl shadow-black/30">
            <img
              src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=650&h=450&fit=crop&q=80"
              alt="Our kitchen at Delhi Tandoori Momo"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
          </div>

          {/* accent badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-4 -right-2 rounded-2xl border border-stone-800/60 bg-stone-900/90 px-5 py-3.5 shadow-xl backdrop-blur sm:-right-5"
          >
            <p className="text-xl font-extrabold text-amber-400">100%</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Vegetarian
            </p>
          </motion.div>
        </motion.div>

        {/* ── Text side ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400/90">
              Our Story
            </span>
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl">
            A Love Letter to{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Delhi Street Food
            </span>
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-400">
            <p>
              <strong className="text-stone-300">Delhi Tandoori Momo</strong>{" "}
              was born from a simple obsession — take the humble momo and give
              it the tandoori treatment it deserves. We fire up the clay oven,
              toss in hand‑folded dumplings loaded with aromatic spices, and
              let smoke and heat work their magic.
            </p>
            <p>
              Beyond momos, we celebrate everything that makes Indian street
              food legendary: crispy burgers with secret sauces, loaded paneer
              sandwiches, and sizzling soya chaap that rivals the best stalls
              on Chandni Chowk.
            </p>
            <p>
              Every recipe is crafted with premium ingredients, traditional
              techniques and an unshakeable belief that street food deserves
              fine‑dining respect.
            </p>
          </div>

          {/* highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { icon: "🥟", text: "Handcrafted Daily" },
              { icon: "🌶️", text: "Bold Spice Blends" },
              { icon: "❤️", text: "Made with Love" },
            ].map((h) => (
              <div
                key={h.text}
                className="flex items-center gap-2.5 rounded-xl border border-stone-800/50 bg-stone-900/50 px-4 py-3"
              >
                <span className="text-lg">{h.icon}</span>
                <span className="text-xs font-semibold text-stone-300">
                  {h.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}