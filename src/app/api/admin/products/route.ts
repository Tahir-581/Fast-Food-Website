import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        modifierGroups: {
          include: {
            options: true
          }
        },
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch admin products error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      name, slug, description, basePrice, imageUrl, calories, categoryId, dietaryTags 
    } = data;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        calories: calories ? parseInt(calories) : null,
        categoryId,
        dietaryTags: Array.isArray(dietaryTags) ? dietaryTags.join(",") : dietaryTags,
        inventory: {
          create: {
            stock: 100, // Initial stock
            unit: "pcs",
            threshold: 10
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
