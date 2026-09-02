"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {/* decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mb-5 flex items-center justify-center gap-4"
      >
        <span className="h-px w-12 origin-right bg-gradient-to-r from-transparent to-amber-500" />
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400/90">
          {label}
        </span>
        <span className="h-px w-12 origin-left bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-serif text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base leading-relaxed text-stone-400 sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}