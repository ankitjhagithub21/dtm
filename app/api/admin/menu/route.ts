import { NextResponse } from "next/server";
import { getAllMenuItems, createMenuItem } from "@/lib/admin";

export async function GET() {
  try {
    const items = await getAllMenuItems();
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load menu items.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (
      !body.name?.trim() ||
      !body.slug?.trim() ||
      !body.description?.trim() ||
      typeof body.price !== "number" ||
      !body.category ||
      !body.image_url?.trim() ||
      typeof body.is_veg !== "boolean" ||
      typeof body.sort_order !== "number"
    ) {
      return NextResponse.json(
        { error: "Required fields: name, slug, description, price, category, image_url, is_veg, sort_order" },
        { status: 400 }
      );
    }

    const validCategories = ["Momos", "Sandwiches", "Burgers", "Soya Chaap"];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be one of: Momos, Sandwiches, Burgers, Soya Chaap" },
        { status: 400 }
      );
    }

    await createMenuItem({
      name: body.name.trim(),
      slug: body.slug.trim(),
      description: body.description.trim(),
      price: body.price,
      category: body.category,
      image_url: body.image_url.trim(),
      badge: body.badge ?? null,
      is_veg: body.is_veg,
      sort_order: body.sort_order,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create menu item.";
    
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
