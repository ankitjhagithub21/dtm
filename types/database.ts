import type { MenuCategory, MenuItem } from "@/data/menuItems";

export interface MenuItemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image_url: string;
  badge: string | null;
  is_veg: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image_url,
    badge: row.badge ?? undefined,
    isVeg: row.is_veg,
  };
}
