"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const totalItems = useCartStore((state) => state.totalItems);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const itemCount = totalItems();
  const orderSubtotal = subtotal();
  const deliveryFee = orderSubtotal >= 300 ? 0 : 30;
  const grandTotal = orderSubtotal + deliveryFee;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pb-16 pt-24 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">
              Your order
            </span>
          </div>
          <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">
            Your <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">Cart</span>
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-stone-800/60 bg-stone-900/70 px-6 py-16 text-center shadow-lg shadow-black/20 backdrop-blur sm:px-10"
          >
            <div className="text-6xl" aria-hidden="true">🥟</div>
            <h2 className="mt-5 font-serif text-3xl text-stone-50">Your Cart is Empty</h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-400">
              Looks like you haven&apos;t added any momos yet. Explore our menu and find your favourites!
            </p>
            <Link
              href="/menu"
              className="group relative mt-8 inline-flex overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10">Browse Menu</span>
            </Link>
          </motion.section>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-10">
            <section className="space-y-4 lg:col-span-2" aria-label="Cart items">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
                    className="flex gap-4 overflow-hidden rounded-2xl border border-stone-800/60 bg-stone-900/70 p-4 shadow-lg shadow-black/20 backdrop-blur"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-800">
                      {imageErrors[item.id] ? (
                        <div className="flex h-full w-full items-center justify-center text-3xl" aria-hidden="true">🥟</div>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={() => setImageErrors((current) => ({ ...current, [item.id]: true }))}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">{item.category}</span>
                          <h2 className="mt-1 font-bold text-stone-100">{item.name}</h2>
                          <p className="mt-1 text-sm text-stone-400">₹{item.price} each</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-xl leading-none text-stone-500 transition-colors hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => decreaseQuantity(item.id)} aria-label={`Decrease quantity of ${item.name}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-700 bg-stone-800 text-lg text-stone-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">−</button>
                          <span className="w-5 text-center text-sm font-bold text-stone-100" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                          <button type="button" onClick={() => increaseQuantity(item.id)} disabled={item.quantity >= 20} aria-label={`Increase quantity of ${item.name}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-700 bg-stone-800 text-lg text-stone-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40">+</button>
                        </div>
                        <span className="font-bold text-amber-400">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </section>

            <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }} aria-label="Order summary" className="mt-8 h-fit rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur lg:sticky lg:top-24 lg:mt-0">
              <h2 className="font-serif text-2xl text-stone-50">Order Summary</h2>
              <p className="mt-1 text-sm text-stone-400">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-stone-400"><span>Subtotal</span><span className="text-stone-200">₹{orderSubtotal}</span></div>
                <div className="flex justify-between text-stone-400"><span>Delivery</span><span className="text-stone-200">{deliveryFee === 0 ? "Free" : "₹30"}</span></div>
              </div>
              <div className="my-5 h-px bg-stone-800" />
              <div className="flex items-center justify-between"><span className="font-bold text-stone-100">Total</span><span className="text-xl font-extrabold text-amber-400">₹{grandTotal}</span></div>
              <Link href="/checkout" className="group relative mt-6 block w-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" /><span className="relative z-10">Place Order</span></Link>
              <button type="button" onClick={clearCart} className="mt-3 w-full rounded-full border border-stone-700 px-8 py-3 text-sm font-semibold text-stone-400 transition-colors hover:border-red-500/30 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Clear Cart</button>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
  );
}
