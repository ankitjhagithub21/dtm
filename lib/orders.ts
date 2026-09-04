import { createClient } from "@/lib/supabase/server";
import { toOrderDetails } from "@/types/database";
import type { OrderItemRow, OrderRow } from "@/types/database";
import type { NewOrderDetails, OrderDetails, PaymentMethod } from "@/types/order";
import type { OrderItem } from "@/types/order";

export type CreateOrderData = NewOrderDetails & { userId?: string | null };

const createOrderNumber = () => {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `DTM-${datePart}-${suffix}`;
};

export function isCreateOrderData(value: unknown): value is CreateOrderData {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;
  const hasValidItem = (item: unknown): item is OrderItem => {
    if (!item || typeof item !== "object") return false;
    const orderItem = item as Record<string, unknown>;

    return (
      typeof orderItem.id === "string" &&
      typeof orderItem.name === "string" &&
      typeof orderItem.price === "number" &&
      Number.isInteger(orderItem.price) &&
      typeof orderItem.quantity === "number" &&
      Number.isInteger(orderItem.quantity) &&
      orderItem.quantity > 0 &&
      typeof orderItem.image === "string" &&
      typeof orderItem.category === "string"
    );
  };

  return (
    typeof data.customerName === "string" &&
    typeof data.phone === "string" &&
    typeof data.address === "string" &&
    (data.landmark === undefined || typeof data.landmark === "string") &&
    (data.specialInstructions === undefined || typeof data.specialInstructions === "string") &&
    (data.userId === undefined || data.userId === null || typeof data.userId === "string") &&
    (data.paymentMethod === "cod" || data.paymentMethod === "online") &&
    Array.isArray(data.items) &&
    data.items.every(hasValidItem) &&
    typeof data.subtotal === "number" &&
    Number.isInteger(data.subtotal) &&
    typeof data.deliveryFee === "number" &&
    Number.isInteger(data.deliveryFee) &&
    typeof data.total === "number" &&
    Number.isInteger(data.total)
  );
}

export async function createOrder(data: CreateOrderData): Promise<OrderDetails> {
  const supabase = await createClient();
  const orderNumber = createOrderNumber();
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: data.userId ?? null,
      customer_name: data.customerName,
      phone: data.phone,
      address: data.address,
      landmark: data.landmark ?? null,
      special_instructions: data.specialInstructions ?? null,
      payment_method: data.paymentMethod as PaymentMethod,
      subtotal: data.subtotal,
      delivery_fee: data.deliveryFee,
      total: data.total,
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    throw new Error(orderError?.message ?? "Unable to create the order.");
  }

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .insert(
      data.items.map((item) => ({
        order_id: orderRow.id,
        menu_item_slug: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    )
    .select();

  if (itemsError || !itemRows) {
    throw new Error(itemsError?.message ?? "Unable to save the order items.");
  }

  return toOrderDetails(orderRow, itemRows);
}

export async function getOrdersForUser(userId: string): Promise<OrderDetails[]> {
  const supabase = await createClient();
  const { data: orderRows, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError || !orderRows) throw new Error(ordersError?.message ?? "Unable to load orders.");
  if (orderRows.length === 0) return [];

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderRows.map((order) => order.id));

  if (itemsError || !itemRows) throw new Error(itemsError?.message ?? "Unable to load order items.");

  return orderRows.map((order) =>
    toOrderDetails(order as OrderRow, itemRows.filter((item) => item.order_id === order.id) as OrderItemRow[]),
  );
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetails | null> {
  const supabase = await createClient();
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError) throw new Error(orderError.message);
  if (!orderRow) return null;

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderRow.id);

  if (itemsError || !itemRows) {
    throw new Error(itemsError?.message ?? "Unable to load the order items.");
  }

  return toOrderDetails(orderRow, itemRows);
}
