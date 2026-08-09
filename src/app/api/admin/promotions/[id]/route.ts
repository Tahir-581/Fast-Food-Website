import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: promotionId } = await params;
  try {
    const body = await req.json();

    const { id, usedCount, ...updateData } = body;

    const updatedPromotion = await prisma.coupon.update({
      where: { id: promotionId },
      data: {
        ...updateData,
        value: updateData.value ? parseFloat(updateData.value) : undefined,
        minOrderValue: updateData.minOrderValue ? parseFloat(updateData.minOrderValue) : undefined,
        usageLimit: updateData.usageLimit ? parseInt(updateData.usageLimit) : undefined,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
      },
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error("Admin update promotion error:", error);
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
  const { id: promotionId } = await params;
  try {
    await prisma.coupon.delete({
      where: { id: promotionId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete promotion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
