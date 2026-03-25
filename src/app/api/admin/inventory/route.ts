import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventory: true,
        category: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { productId, stock, threshold, unit } = await req.json();

    const inventory = await prisma.inventory.upsert({
      where: { productId },
      update: {
        stock: stock !== undefined ? parseInt(stock) : undefined,
        threshold: threshold !== undefined ? parseInt(threshold) : undefined,
        unit: unit || undefined,
      },
      create: {
        productId,
        stock: stock ? parseInt(stock) : 0,
        threshold: threshold ? parseInt(threshold) : 10,
        unit: unit || "pcs",
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Admin inventory update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
