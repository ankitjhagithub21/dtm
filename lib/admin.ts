import { createClient } from "@/lib/supabase/server";
import { toOrderDetails, toMenuItem } from "@/types/database";
import type { OrderDetails } from "@/types/order";
import type { MenuItem } from "@/data/menuItems";
import type { OrderItemRow, OrderRow, MenuItemRow } from "@/types/database";

export async function verifyAdminRole(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
    
  return profile?.role === "admin";
}

export async function getAllOrders(): Promise<OrderDetails[]> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { data: orderRows, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError || !orderRows) {
    throw new Error(ordersError?.message ?? "Unable to load orders.");
  }

  if (orderRows.length === 0) return [];

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderRows.map((order) => order.id));

  if (itemsError || !itemRows) {
    throw new Error(itemsError?.message ?? "Unable to load order items.");
  }

  return orderRows.map((order) =>
    toOrderDetails(order as OrderRow, itemRows.filter((item) => item.order_id === order.id) as OrderItemRow[]),
  );
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateOrderStatusByNumber(orderNumber: string, status: string): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_number", orderNumber);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardStats(): Promise<{
  totalOrdersToday: number;
  revenueToday: number;
  pendingOrders: number;
  popularItem: string | null;
}> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: todayOrders, error: todayError } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", today.toISOString())
    .not("status", "eq", "cancelled");

  if (todayError) {
    throw new Error(todayError.message);
  }

  const totalOrdersToday = todayOrders?.length ?? 0;
  const revenueToday = todayOrders?.reduce((sum, order) => sum + order.total, 0) ?? 0;
  
  const { data: pendingOrders, error: pendingError } = await supabase
    .from("orders")
    .select("count")
    .in("status", ["confirmed", "preparing", "out_for_delivery"]);

  if (pendingError) {
    throw new Error(pendingError.message);
  }

  const pendingCount = Array.isArray(pendingOrders) ? pendingOrders.length : 0;

  const { data: allItems, error: itemsError } = await supabase
    .from("order_items")
    .select("name, quantity");

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const itemCounts = new Map<string, number>();
  allItems?.forEach((item) => {
    const current = itemCounts.get(item.name) ?? 0;
    itemCounts.set(item.name, current + item.quantity);
  });

  let popularItem: string | null = null;
  let maxCount = 0;
  itemCounts.forEach((count, name) => {
    if (count > maxCount) {
      maxCount = count;
      popularItem = name;
    }
  });

  return {
    totalOrdersToday,
    revenueToday,
    pendingOrders: pendingCount,
    popularItem,
  };
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to load menu items.");
  }

  return data.map(toMenuItem);
}

export async function createMenuItem(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: "Momos" | "Sandwiches" | "Burgers" | "Soya Chaap";
  image_url: string;
  badge?: string | null;
  is_veg: boolean;
  sort_order: number;
}): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      category: data.category,
      image_url: data.image_url,
      badge: data.badge ?? null,
      is_veg: data.is_veg,
      is_available: true,
      sort_order: data.sort_order,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateMenuItem(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  category?: "Momos" | "Sandwiches" | "Burgers" | "Soya Chaap";
  image_url?: string;
  badge?: string | null;
  is_veg?: boolean;
  sort_order?: number;
}): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update(data)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin role required");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
