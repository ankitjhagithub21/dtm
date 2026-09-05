import { NextResponse } from "next/server";
import { updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from "@/lib/admin";

interface MenuRouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: MenuRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {};
    
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.slug !== undefined) updateData.slug = body.slug.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.price !== undefined) updateData.price = body.price;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.image_url !== undefined) updateData.image_url = body.image_url.trim();
    if (body.badge !== undefined) updateData.badge = body.badge ?? null;
    if (body.is_veg !== undefined) updateData.is_veg = body.is_veg;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 }
      );
    }

    if (updateData.category) {
      const validCategories = ["Momos", "Sandwiches", "Burgers", "Soya Chaap"];
      if (!validCategories.includes(updateData.category as string)) {
        return NextResponse.json(
          { error: "Invalid category. Must be one of: Momos, Sandwiches, Burgers, Soya Chaap" },
          { status: 400 }
        );
      }
    }

    await updateMenuItem(id, updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update menu item.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: MenuRouteProps) {
  try {
    const { id } = await params;
    
    await deleteMenuItem(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete menu item.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: MenuRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (typeof body.is_available !== "boolean") {
      return NextResponse.json(
        { error: "is_available field is required and must be a boolean." },
        { status: 400 }
      );
    }

    await toggleMenuItemAvailability(id, body.is_available);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to toggle menu item availability.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
