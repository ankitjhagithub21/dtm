"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Order Now", href: "/menu" },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-800/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* ── Brand ──────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Delhi{" "}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
                Tandoori
              </span>{" "}
              Momo
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">
              Handcrafted tandoori momos and bold Indian street food — made
              fresh, served with soul, every single day.
            </p>
          </div>

          {/* ── Quick Links ────────────────────── */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors duration-200 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Hours ──────────────────────────── */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              Opening Hours
            </h4>
            <div className="space-y-2 text-sm text-stone-400">
              <p>
                <span className="text-stone-300">Mon — Sat:</span> 11 AM – 10 PM
              </p>
              <p>
                <span className="text-stone-300">Sunday:</span> 12 PM – 9 PM
              </p>
            </div>
          </div>

          {/* ── Contact CTA ────────────────────── */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              Get in Touch
            </h4>
            <p className="mb-4 text-sm text-stone-400">
              Have a question or a catering request? We&apos;d love to hear
              from you.
            </p>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200"
            >
              Contact Us
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
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

        {/* bottom bar */}
        <div className="mt-12 border-t border-stone-800/50 pt-6 text-center">
          <p className="text-xs tracking-widest text-stone-600">
            © {new Date().getFullYear()} Delhi Tandoori Momo — All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}