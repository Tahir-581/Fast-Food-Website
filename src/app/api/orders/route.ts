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
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders history error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, subtotal, tax, deliveryFee, total, address, type } = await req.json();

    // High-integrity transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          type: type || "DELIVERY",
          subtotal,
          tax,
          deliveryFee,
          total,
          address: address || "Pickup at Studio",
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              nameAtPurchase: item.name,
              priceAtPurchase: item.basePrice || item.price,
              quantity: item.quantity,
              customizations: item.customizations ? JSON.stringify(item.customizations) : null,
            })),
          },
          payment: {
            create: {
              status: "CAPTURED", // Simulate successful payment for now
              amount: total,
              provider: "STRIPE_MOCK",
            }
          }
        },
        include: {
          items: true,
        }
      });

      // 2. Clear Cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id }
      });

      // 3. Award Sparks (1 per $10)
      const sparksToAward = Math.floor(total / 10);
      if (sparksToAward > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            sparks: { increment: sparksToAward }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Order failed to process" }, { status: 500 });
  }
}
