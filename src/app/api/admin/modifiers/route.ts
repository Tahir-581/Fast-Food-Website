import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, minSelection, maxSelection, isRequired, options } = body;

    const modifierGroup = await prisma.modifierGroup.create({
      data: {
        name,
        minSelection: minSelection ? parseInt(minSelection) : 0,
        maxSelection: maxSelection ? parseInt(maxSelection) : 1,
        isRequired: !!isRequired,
        options: {
          create: options.map((opt: any) => ({
            name: opt.name,
            price: parseFloat(opt.price) || 0,
            isAvailable: opt.isAvailable !== false,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(modifierGroup, { status: 201 });
  } catch (error) {
    console.error("Admin create modifier group error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const modifierGroups = await prisma.modifierGroup.findMany({
      include: {
        options: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(modifierGroups);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
