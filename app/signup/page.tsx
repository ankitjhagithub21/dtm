import type { Metadata } from "next";
import SignupClient from "@/components/auth/SignupClient";
export const metadata: Metadata = { title: "Sign Up | Delhi Tandoori Momo" };
export default function SignupPage() { return <SignupClient />; }
