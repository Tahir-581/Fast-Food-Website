import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: groupId } = await params;
  try {
    const body = await req.json();

    const { options, ...updateData } = body;

    // Update the group itself
    const updatedGroup = await prisma.modifierGroup.update({
      where: { id: groupId },
      data: {
        ...updateData,
        minSelection: updateData.minSelection ? parseInt(updateData.minSelection) : undefined,
        maxSelection: updateData.maxSelection ? parseInt(updateData.maxSelection) : undefined,
      },
    });

    // Handle options update (simple overwrite for now in this MVP)
    if (options && Array.isArray(options)) {
      // Delete existing options
      await prisma.modifierOption.deleteMany({
        where: { modifierGroupId: groupId },
      });

      // Create new ones
      await prisma.modifierOption.createMany({
        data: options.map((opt: any) => ({
          name: opt.name,
          price: parseFloat(opt.price) || 0,
          isAvailable: opt.isAvailable !== false,
          modifierGroupId: groupId,
        })),
      });
    }

    const finalGroup = await prisma.modifierGroup.findUnique({
      where: { id: groupId },
      include: { options: true },
    });

    return NextResponse.json(finalGroup);
  } catch (error) {
    console.error("Admin update modifier group error:", error);
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
  const { id: groupId } = await params;
  try {
    await prisma.modifierGroup.delete({
      where: { id: groupId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete modifier group error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
