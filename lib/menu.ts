import { menuItems } from "@/data/menuItems";
import { createClient } from "@/lib/supabase/server";
import { toMenuItemForMenu } from "@/types/database";
import type { MenuItem } from "@/data/menuItems";

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase menu query skipped because environment variables are missing.");
    return menuItems;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      console.error("Unable to load menu items from Supabase:", error);
      return menuItems;
    }

    return data.map(toMenuItemForMenu);
  } catch (error) {
    console.error("Unable to load menu items from Supabase:", error);
    return menuItems;
  }
}
