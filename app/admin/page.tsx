import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllOrders, getAllMenuItems, getDashboardStats } from "@/lib/admin";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Delhi Tandoori Momo",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  try {
    const [orders, menuItems, stats] = await Promise.all([
      getAllOrders(),
      getAllMenuItems(),
      getDashboardStats(),
    ]);

    return (
      <AdminDashboardClient
        initialOrders={orders}
        initialMenuItems={menuItems}
        initialStats={stats}
      />
    );
  } catch (error) {
    console.error("Failed to load admin data:", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-stone-100 mb-4">Error Loading Dashboard</h1>
          <p className="text-stone-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
