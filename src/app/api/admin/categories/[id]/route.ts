import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  try {
    const body = await req.json();

    const { id, _count, ...updateData } = body;

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...updateData,
        displayOrder: updateData.displayOrder ? parseInt(updateData.displayOrder) : undefined,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Admin update category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
