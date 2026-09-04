"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

/* ──────────────────────────────────────────────
   Navigation data — edit links here
   ────────────────────────────────────────────── */
const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" }
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const totalItems = useCartStore((state) => state.totalItems);
    const cartItemCount = totalItems();

    /* scroll‑aware background */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => {
        // The pathname is the external route signal that closes this controlled menu.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
    }, [pathname]);

    /* lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    /* active‑route helper */
    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled
                    ? "border-b border-stone-800/50 bg-stone-950/90 shadow-lg shadow-black/20 backdrop-blur-xl"
                    : "bg-transparent"
                }`}
        >
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
                aria-label="Main navigation"
            >
                {/* ── Logo ──────────────────────────────── */}

                <Link href="/">
                    <Image
                        src="/logo2.png"
                        alt="Delhi Tandoori Momo Logo"
                        width={50}
                        height={50}
                        loading="eager"
                    />
                </Link>


                {/* ── Desktop Links ─────────────────────── */}
                <ul className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${active
                                            ? "text-amber-400"
                                            : "text-stone-400 hover:text-amber-300"
                                        }`}
                                >
                                    {link.label}

                                    {/* active underline */}
                                    {active && (
                                        <motion.span
                                            layoutId="navActiveUnderline"
                                            className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* ── Desktop Cart + CTA ─────────────────── */}
                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        href="/cart"
                        aria-label="View cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-800/60 bg-stone-900/70 text-stone-300 backdrop-blur transition-colors duration-200 hover:border-amber-600/40 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 11H7L6 8Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8a3 3 0 0 1 6 0" />
                        </svg>
                        <AnimatePresence>
                            {cartItemCount > 0 && (
                                <motion.span
                                    key={cartItemCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    aria-live="polite"
                                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1 text-[10px] font-bold text-stone-950"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <Link
                        href="/menu"
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md shadow-amber-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-700/40 hover:brightness-110 active:scale-95"
                    >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative z-10">Order Now</span>
                    </Link>
                </div>

                {/* ── Mobile Cart + Hamburger ───────────── */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Link
                        href="/cart"
                        aria-label="View cart"
                        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-stone-800/60 bg-stone-900/70 text-stone-300 backdrop-blur transition-colors duration-200 hover:border-amber-600/40 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 11H7L6 8Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8a3 3 0 0 1 6 0" />
                        </svg>
                        <AnimatePresence>
                            {cartItemCount > 0 && (
                                <motion.span
                                    key={cartItemCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    aria-live="polite"
                                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1 text-[10px] font-bold text-stone-950"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-stone-800/60 bg-stone-900/70 text-stone-300 backdrop-blur transition-colors duration-200 hover:border-amber-600/40 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    <div className="flex h-4 w-5 flex-col items-center justify-center gap-[5px]">
                        {/* top bar */}
                        <motion.span
                            animate={
                                isOpen
                                    ? { rotate: 45, y: 7, backgroundColor: "#fbbf24" }
                                    : { rotate: 0, y: 0, backgroundColor: "#d6d3d1" }
                            }
                            transition={{ duration: 0.25 }}
                            className="block h-[2px] w-full rounded-full origin-center"
                        />
                        {/* middle bar */}
                        <motion.span
                            animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                            className="block h-[2px] w-full rounded-full bg-stone-300"
                        />
                        {/* bottom bar */}
                        <motion.span
                            animate={
                                isOpen
                                    ? { rotate: -45, y: -7, backgroundColor: "#fbbf24" }
                                    : { rotate: 0, y: 0, backgroundColor: "#d6d3d1" }
                            }
                            transition={{ duration: 0.25 }}
                            className="block h-[2px] w-full rounded-full origin-center"
                        />
                    </div>
                    </button>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ─────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* backdrop */}
                        <motion.div
                            key="mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 top-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* panel */}
                        <motion.div
                            key="mobile-panel"
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation"
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="fixed left-0 right-0 top-0 z-40 flex min-h-screen flex-col border-t border-stone-800/40 bg-stone-950/95 pt-24 backdrop-blur-xl lg:hidden"
                        >
                            <ul className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
                                {navLinks.map((link, i) => {
                                    const active = isActive(link.href);
                                    return (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.35,
                                                delay: 0.08 * i,
                                                ease: "easeOut",
                                            }}
                                            className="w-full max-w-xs"
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-center rounded-2xl px-6 py-4 text-center text-lg font-semibold tracking-wide transition-all duration-200 ${active
                                                        ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                                                        : "text-stone-300 hover:bg-stone-900/60 hover:text-amber-300"
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    );
                                })}

                                {/* mobile CTA */}
                                <motion.li
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.08 * navLinks.length,
                                        ease: "easeOut",
                                    }}
                                    className="mt-6 w-full max-w-xs"
                                >
                                    <Link
                                        href="/menu"
                                        onClick={() => setIsOpen(false)}
                                        className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95"
                                    >
                                        <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <span className="relative z-10">Order Now</span>
                                    </Link>
                                </motion.li>
                            </ul>

                            {/* bottom tagline */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="pb-10 text-center text-xs tracking-widest text-stone-600"
                            >
                                © {new Date().getFullYear()} Delhi Tandoori Momo
                            </motion.p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
