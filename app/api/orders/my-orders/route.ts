import { NextResponse } from "next/server";
import { getOrdersForUser } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
export async function GET() { try { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); const orders = await getOrdersForUser(user.id); return NextResponse.json({ orders }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load orders." }, { status: 500 }); } }
