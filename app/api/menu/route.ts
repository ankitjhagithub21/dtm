import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/menu";

export const revalidate = 60;

export async function GET() {
  const items = await getMenuItems();

  return NextResponse.json({ items });
}
