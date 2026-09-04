"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import type { PaymentMethod } from "@/types/order";

interface CheckoutForm {
  customerName: string;
  phone: string;
  address: string;
  landmark: string;
  specialInstructions: string;
}

type FormErrors = Partial<Record<keyof Pick<CheckoutForm, "customerName" | "phone" | "address">, string>>;

const inputClassName = "mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20";

export default function CheckoutPageClient() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const [form, setForm] = useState<CheckoutForm>({ customerName: "", phone: "", address: "", landmark: "", specialInstructions: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderSubtotal = subtotal();
  const deliveryFee = orderSubtotal >= 300 ? 0 : 30;
  const total = orderSubtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0) router.replace("/menu");
  }, [items.length, router]);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.address.trim()) nextErrors.address = "Please enter your delivery address.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    const order = placeOrder({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      landmark: form.landmark.trim() || undefined,
      specialInstructions: form.specialInstructions.trim() || undefined,
      paymentMethod,
      items: items.map((item) => ({ ...item })),
      subtotal: orderSubtotal,
      deliveryFee,
      total,
    });
    clearCart();
    router.push(`/order-confirmation/${order.orderId}`);
  };

  if (items.length === 0) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pb-16 pt-24 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-10">
          <div className="mb-3 flex items-center gap-3"><span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" /><span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">Almost there</span></div>
          <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">Checkout <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">Details</span></h1>
        </motion.div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          <motion.form id="checkout-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }} onSubmit={handleSubmit} noValidate className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur sm:p-8" aria-labelledby="delivery-details">
              <h2 id="delivery-details" className="font-serif text-2xl text-stone-50">Delivery Details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><label htmlFor="customerName" className="text-sm font-semibold text-stone-200">Full Name</label><input id="customerName" value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} aria-invalid={Boolean(errors.customerName)} aria-describedby={errors.customerName ? "customerName-error" : undefined} autoComplete="name" className={inputClassName} placeholder="Your name" />{errors.customerName && <p id="customerName-error" className="mt-2 text-xs text-red-400">{errors.customerName}</p>}</div>
                <div className="sm:col-span-2"><label htmlFor="phone" className="text-sm font-semibold text-stone-200">Phone Number</label><input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} autoComplete="tel" inputMode="numeric" className={inputClassName} placeholder="10-digit mobile number" />{errors.phone && <p id="phone-error" className="mt-2 text-xs text-red-400">{errors.phone}</p>}</div>
                <div className="sm:col-span-2"><label htmlFor="address" className="text-sm font-semibold text-stone-200">Delivery Address</label><textarea id="address" value={form.address} onChange={(event) => updateField("address", event.target.value)} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} autoComplete="street-address" rows={3} className={inputClassName} placeholder="House / flat number, street and area" />{errors.address && <p id="address-error" className="mt-2 text-xs text-red-400">{errors.address}</p>}</div>
                <div><label htmlFor="landmark" className="text-sm font-semibold text-stone-200">Landmark <span className="font-normal text-stone-500">(optional)</span></label><input id="landmark" value={form.landmark} onChange={(event) => updateField("landmark", event.target.value)} className={inputClassName} placeholder="Nearby landmark" /></div>
                <div><label htmlFor="instructions" className="text-sm font-semibold text-stone-200">Special Instructions <span className="font-normal text-stone-500">(optional)</span></label><input id="instructions" value={form.specialInstructions} onChange={(event) => updateField("specialInstructions", event.target.value)} className={inputClassName} placeholder="Any delivery notes" /></div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur sm:p-8" aria-labelledby="payment-method">
              <h2 id="payment-method" className="font-serif text-2xl text-stone-50">Payment Method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                <button type="button" role="radio" aria-checked={paymentMethod === "cod"} onClick={() => setPaymentMethod("cod")} className={`rounded-2xl border p-4 text-left transition-colors ${paymentMethod === "cod" ? "border-amber-500/50 bg-amber-500/10" : "border-stone-700 bg-stone-950/40 hover:border-amber-500/30"}`}><span className="flex items-center justify-between"><span className="font-bold text-stone-100">Cash on Delivery</span><span className={`flex h-4 w-4 rounded-full border-2 ${paymentMethod === "cod" ? "border-amber-400 bg-amber-400 shadow-[inset_0_0_0_3px_#1c1917]" : "border-stone-600"}`} /></span><span className="mt-1 block text-sm text-stone-400">Pay when your order arrives.</span></button>
                <div className="relative cursor-not-allowed rounded-2xl border border-stone-800 bg-stone-950/30 p-4 opacity-60" aria-disabled="true"><span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-stone-600 to-stone-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-100">Coming Soon</span><span className="font-bold text-stone-400">Pay Online</span><span className="mt-1 block text-sm text-stone-500">Secure digital payments.</span></div>
              </div>
            </section>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18, ease: "easeOut" }} className="mt-8 h-fit rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur lg:sticky lg:top-24 lg:mt-0" aria-label="Order summary">
            <h2 className="font-serif text-2xl text-stone-50">Order Summary</h2>
            <div className="mt-5 max-h-56 space-y-3 overflow-y-auto pr-1">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold text-stone-200">{item.name}</p><p className="text-stone-500">{item.quantity} × ₹{item.price}</p></div><span className="shrink-0 font-semibold text-stone-300">₹{item.quantity * item.price}</span></div>)}</div>
            <div className="my-5 h-px bg-stone-800" />
            <div className="space-y-3 text-sm"><div className="flex justify-between text-stone-400"><span>Subtotal</span><span className="text-stone-200">₹{orderSubtotal}</span></div><div className="flex justify-between text-stone-400"><span>Delivery</span><span className="text-stone-200">{deliveryFee === 0 ? "Free" : "₹30"}</span></div></div>
            <div className="my-5 h-px bg-stone-800" /><div className="flex items-center justify-between"><span className="font-bold text-stone-100">Total</span><span className="text-xl font-extrabold text-amber-400">₹{total}</span></div>
            <button type="submit" form="checkout-form" disabled={isSubmitting} className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-70"><span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />{isSubmitting ? <span className="relative z-10 flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950/30 border-t-stone-950" />Placing Order</span> : <span className="relative z-10">Place Order</span>}</button>
            <Link href="/cart" className="mt-4 block text-center text-sm text-stone-400 transition-colors hover:text-amber-300">Back to cart</Link>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
