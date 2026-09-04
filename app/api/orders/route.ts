import { NextResponse } from "next/server";
import { createOrder, isCreateOrderData } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isCreateOrderData(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid order details." },
        { status: 400 },
      );
    }

    if (
      !body.customerName.trim() ||
      !/^[6-9]\d{9}$/.test(body.phone.trim()) ||
      !body.address.trim() ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Name, phone, address, and at least one item are required." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    if (body.userId && body.userId !== userId) {
      return NextResponse.json({ success: false, error: "Invalid user session." }, { status: 401 });
    }

    const order = await createOrder({
      ...body,
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      landmark: body.landmark?.trim() || undefined,
      specialInstructions: body.specialInstructions?.trim() || undefined,
      userId,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the order.";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
