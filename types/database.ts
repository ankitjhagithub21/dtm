import type { MenuCategory, MenuItem } from "@/data/menuItems";
import type { OrderDetails, OrderItem, OrderStatus, PaymentMethod } from "@/types/order";

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
    dbId: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image_url,
    badge: row.badge ?? undefined,
    isVeg: row.is_veg,
    isAvailable: row.is_available,
  };
}

export function toMenuItemForMenu(row: MenuItemRow): MenuItem {
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

export interface OrderRow {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  address: string;
  landmark: string | null;
  special_instructions: string | null;
  payment_method: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  estimated_time: string | null;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  menu_item_slug: string | null;
  name: string;
  price: number;
  quantity: number;
}

export function toOrderDetails(orderRow: OrderRow, orderItemRows: OrderItemRow[]): OrderDetails {
  const items: OrderItem[] = orderItemRows.map((item) => ({
    id: item.menu_item_slug ?? item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: "",
    category: "",
  }));

  return {
    dbId: orderRow.id,
    orderId: orderRow.order_number,
    customerName: orderRow.customer_name,
    phone: orderRow.phone,
    address: orderRow.address,
    landmark: orderRow.landmark ?? undefined,
    specialInstructions: orderRow.special_instructions ?? undefined,
    paymentMethod: orderRow.payment_method,
    items,
    subtotal: orderRow.subtotal,
    deliveryFee: orderRow.delivery_fee,
    total: orderRow.total,
    status: orderRow.status as OrderStatus,
    createdAt: orderRow.created_at,
    estimatedTime: orderRow.estimated_time ?? "30-40 minutes",
  };
}
