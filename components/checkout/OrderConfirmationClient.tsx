"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";

interface OrderConfirmationClientProps {
  orderId: string;
}

const cardTransition = (delay: number) => ({ duration: 0.45, delay, ease: "easeOut" as const });

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const currentOrder = useOrderStore((state) => state.currentOrder);

  if (!currentOrder || currentOrder.orderId !== orderId) {
    return (
      <main className="flex min-h-screen items-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 pt-20 text-stone-100">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto w-full max-w-lg rounded-2xl border border-stone-800/60 bg-stone-900/70 px-6 py-14 text-center shadow-lg shadow-black/20 backdrop-blur">
          <div className="text-5xl" aria-hidden="true">🥟</div>
          <h1 className="mt-5 font-serif text-3xl text-stone-50">Order Not Found</h1>
          <p className="mt-3 text-stone-400">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Link href="/" className="group relative mt-8 inline-flex overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95"><span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" /><span className="relative z-10">Go Home</span></Link>
        </motion.section>
      </main>
    );
  }

  const order = currentOrder;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pb-16 pt-28 text-stone-100">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 shadow-lg shadow-emerald-900/20">
          <svg viewBox="0 0 52 52" className="h-11 w-11" aria-label="Order confirmed">
            <motion.path d="M14 27l8 8 17-19" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }} />
          </svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={cardTransition(0.2)}>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">Thank you, {order.customerName}</p>
          <h1 className="mt-3 font-serif text-4xl text-stone-50 sm:text-5xl">Order <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">Confirmed!</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">Your kitchen crew is getting your favourites ready. We&apos;ll have them on their way soon.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={cardTransition(0.32)} className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-5 text-left shadow-lg shadow-black/20 backdrop-blur"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">Order ID</p><p className="mt-2 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-bold tracking-wide text-amber-300">{order.orderId}</p></section>
          <section className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-5 text-left shadow-lg shadow-black/20 backdrop-blur"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">Estimated delivery</p><p className="mt-2 font-serif text-2xl text-stone-50">{order.estimatedTime}</p></section>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={cardTransition(0.42)} className="mt-4 rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 text-left shadow-lg shadow-black/20 backdrop-blur sm:p-8" aria-label="Order details">
          <div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-stone-50">Order Details</h2><span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Confirmed</span></div>
          <div className="mt-6 space-y-3">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 text-sm"><div><p className="font-semibold text-stone-200">{item.name}</p><p className="text-stone-500">{item.quantity} × ₹{item.price}</p></div><span className="font-semibold text-stone-300">₹{item.price * item.quantity}</span></div>)}</div>
          <div className="my-5 h-px bg-stone-800" /><div className="space-y-2 text-sm"><div className="flex justify-between text-stone-400"><span>Subtotal</span><span>₹{order.subtotal}</span></div><div className="flex justify-between text-stone-400"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}</span></div><div className="flex justify-between pt-2 text-base font-bold text-stone-100"><span>Total</span><span className="text-amber-400">₹{order.total}</span></div></div>
          <div className="my-5 h-px bg-stone-800" /><div className="grid gap-5 text-sm sm:grid-cols-2"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">Delivering to</p><p className="mt-2 leading-relaxed text-stone-300">{order.address}{order.landmark ? `, near ${order.landmark}` : ""}</p><p className="mt-1 text-stone-500">{order.phone}</p></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">Payment</p><p className="mt-2 text-stone-300">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>{order.specialInstructions && <p className="mt-3 text-stone-500">Note: {order.specialInstructions}</p>}</div></div>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={cardTransition(0.52)} className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95"><span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" /><span className="relative z-10">Back to Home</span></Link><Link href="/menu" className="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3.5 text-sm font-semibold text-amber-300 backdrop-blur transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200">View Menu</Link></motion.div>
      </div>
    </main>
  );
}
