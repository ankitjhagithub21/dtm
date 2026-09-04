"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

type LoginMethod = "phone" | "email";

const inputClassName = "mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20";

interface LoginClientProps {
  redirectTo?: string;
}

export default function LoginClient({ redirectTo }: LoginClientProps) {
  const router = useRouter();
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirect = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  const phoneNumber = `+91${phone}`;

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit Indian mobile number.");
    setError(""); setMessage(""); setIsLoading(true);
    try {
      const { error: otpError } = await createClient().auth.signInWithOtp({ phone: phoneNumber });
      if (otpError) throw otpError;
      setOtpSent(true); setMessage("OTP sent to your mobile number.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to send OTP."); }
    finally { setIsLoading(false); }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit OTP.");
    setError(""); setIsLoading(true);
    try {
      const { error: otpError } = await createClient().auth.verifyOtp({ phone: phoneNumber, token: otp, type: "sms" });
      if (otpError) throw otpError;
      await fetchProfile(); router.replace(redirect);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to verify OTP."); }
    finally { setIsLoading(false); }
  };

  const signIn = async () => {
    if (!email || !password) return setError("Enter your email and password.");
    setError(""); setIsLoading(true);
    try {
      const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      await fetchProfile(); router.replace(redirect);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to sign in."); }
    finally { setIsLoading(false); }
  };

  return <main className="flex min-h-screen items-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-28 text-stone-100"><motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mx-auto w-full max-w-md rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur sm:p-8"><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">Welcome back</p><h1 className="mt-3 font-serif text-4xl text-stone-50">Sign <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">In</span></h1><div className="mt-7 grid grid-cols-2 rounded-xl border border-stone-800 bg-stone-950/50 p-1"><button type="button" onClick={() => { setMethod("phone"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${method === "phone" ? "bg-amber-500/15 text-amber-300" : "text-stone-500 hover:text-stone-300"}`}>Phone OTP</button><button type="button" onClick={() => { setMethod("email"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${method === "email" ? "bg-amber-500/15 text-amber-300" : "text-stone-500 hover:text-stone-300"}`}>Email</button></div>{method === "phone" ? <div className="mt-6 space-y-5"><div><label htmlFor="phone" className="text-sm font-semibold text-stone-200">Mobile Number</label><div className="mt-2 flex rounded-xl border border-stone-700 bg-stone-950/60 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20"><span className="border-r border-stone-700 px-4 py-3 text-sm text-stone-400">+91</span><input id="phone" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="10-digit mobile number" /></div></div>{otpSent && <div><label htmlFor="otp" className="text-sm font-semibold text-stone-200">One-Time Password</label><input id="otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className={inputClassName} placeholder="6-digit OTP" /></div>}<button type="button" onClick={otpSent ? verifyOtp : sendOtp} disabled={isLoading} className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 disabled:opacity-70">{isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-stone-950/30 border-t-stone-950" />}{otpSent ? "Verify OTP" : "Send OTP"}</button></div> : <div className="mt-6 space-y-5"><div><label htmlFor="email" className="text-sm font-semibold text-stone-200">Email Address</label><input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className={inputClassName} placeholder="you@example.com" /></div><div><label htmlFor="password" className="text-sm font-semibold text-stone-200">Password</label><input id="password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" className={inputClassName} placeholder="Your password" /></div><button type="button" onClick={signIn} disabled={isLoading} className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg shadow-amber-900/30 disabled:opacity-70">{isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-stone-950/30 border-t-stone-950" />}Sign In</button></div>}{message && <p className="mt-4 text-sm text-amber-300" role="status">{message}</p>}{error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}<p className="mt-6 text-center text-sm text-stone-400">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-amber-300 hover:text-amber-200">Sign Up</Link></p></motion.section></main>;
}
