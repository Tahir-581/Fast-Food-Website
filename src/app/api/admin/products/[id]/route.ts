import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      name, slug, description, basePrice, imageUrl, calories, categoryId, dietaryTags, isAvailable 
    } = data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        calories: calories ? parseInt(calories) : null,
        categoryId,
        dietaryTags: Array.isArray(dietaryTags) ? dietaryTags.join(",") : dietaryTags,
        isAvailable
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete in order to handle relations or use cascading in schema
    // Since we didn't specify cascade for all, let's be careful
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
