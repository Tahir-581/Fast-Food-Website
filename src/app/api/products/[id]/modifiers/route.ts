import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const modifierGroups = await prisma.modifierGroup.findMany({
      where: { productId: id },
      include: {
        options: true,
      },
    });

    return NextResponse.json(modifierGroups);
  } catch (error) {
    console.error("Fetch modifiers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
