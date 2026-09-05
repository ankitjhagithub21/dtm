import { NextResponse } from "next/server";
import { updateOrderStatus, updateOrderStatusByNumber } from "@/lib/admin";

interface StatusRouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: StatusRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (typeof body.status !== "string" || !body.status.trim()) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    // Support both direct ID and order number
    if (body.orderNumber) {
      await updateOrderStatusByNumber(body.orderNumber, body.status.trim());
    } else {
      await updateOrderStatus(id, body.status.trim());
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order status.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    if (message.includes("Invalid status")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
