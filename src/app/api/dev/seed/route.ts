import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Clear existing data
    await prisma.modifierOption.deleteMany();
    await prisma.modifierGroup.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Categories
    const burgers = await prisma.category.create({
      data: { name: "Burgers", slug: "burgers", icon: "🍔" },
    });
    const sides = await prisma.category.create({
      data: { name: "Sides", slug: "sides", icon: "🍟" },
    });

    // Products
    const wagyu = await prisma.product.create({
      data: {
        name: "Midnight Wagyu Burger",
        slug: "midnight-wagyu",
        description: "Double wagyu beef patties, aged cheddar, caramelized onions, and our secret Ember sauce.",
        basePrice: 18.50,
        imageUrl: "/images/burger-1.jpg",
        calories: 850,
        dietaryTags: "Bestseller, Chef Choice",
        categoryId: burgers.id,
      },
    });

    // Modifiers for Wagyu
    const pattyGroup = await prisma.modifierGroup.create({
      data: {
        name: "Patties",
        productId: wagyu.id,
        minSelection: 1,
        maxSelection: 2,
      },
    });

    await prisma.modifierOption.createMany({
      data: [
        { name: "Extra Wagyu Patty", priceModifier: 6.0, groupId: pattyGroup.id },
        { name: "No Patty", priceModifier: 0.0, groupId: pattyGroup.id },
      ],
    });

    return NextResponse.json({ message: "Seeding complete" });
  } catch (error) {
    console.error("Dev seeding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
