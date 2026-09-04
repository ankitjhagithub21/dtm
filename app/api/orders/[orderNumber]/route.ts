import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/orders";

interface OrderRouteProps {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_: Request, { params }: OrderRouteProps) {
  try {
    const { orderNumber } = await params;
    const order = await getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load the order.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
