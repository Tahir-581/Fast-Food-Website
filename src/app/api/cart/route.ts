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
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(cartItems.map((item: any) => ({
      ...item,
      modifiers: item.modifiers ? JSON.parse(item.modifiers) : []
    })));
  } catch (error) {
    console.error("Fetch cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await req.json();

    // Clear and replace for transactional integrity in this phase
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
      prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          userId: session.user.id,
          productId: item.id,
          quantity: item.quantity,
          modifiers: item.customizations ? JSON.stringify(item.customizations) : null,
        }))
      })
    ]);


    return NextResponse.json({ message: "Cart synced" });
  } catch (error) {
    console.error("Sync cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
