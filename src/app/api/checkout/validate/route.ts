import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, promoCode, addressId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch product details for server-side validation
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    items.forEach((item: any) => {
      const product = products.find((p: any) => p.id === item.productId);
      if (product) {
        subtotal += product.basePrice * item.quantity;
      }
    });

    let discount = 0;
    if (promoCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: promoCode, isActive: true },
      });
      if (coupon) {
        if (coupon.type === "PERCENT") {
          discount = (subtotal * coupon.value) / 100;
        } else {
          discount = coupon.value;
        }
      }
    }

    const deliveryFee = 5.0; // Mock delivery fee
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + tax + deliveryFee;

    return NextResponse.json({
      breakdown: {
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
      },
      isValid: true,
    });
  } catch (error) {
    console.error("Checkout validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
