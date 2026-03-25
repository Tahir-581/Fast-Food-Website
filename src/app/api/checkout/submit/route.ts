import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const { items, addressId, orderType } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Execute order submission in a single interactive transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // 1. Fetch products and check inventory
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i: any) => i.productId) } },
        include: { inventory: true },
      });

      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const product = products.find((p: any) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (!product.isAvailable) throw new Error(`${product.name} is currently unavailable`);

        // Check Inventory
        if (product.inventory) {
          if (product.inventory.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          // Deduct Stock
          await tx.inventory.update({
            where: { productId: product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }

        subtotal += product.basePrice * item.quantity;
        orderItemsToCreate.push({
          productId: item.productId,
          nameAtPurchase: product.name,
          priceAtPurchase: product.basePrice,
          quantity: item.quantity,
          customizations: item.modifiers ? JSON.stringify(item.modifiers) : null,
        });
      }

      const tax = subtotal * 0.08;
      const deliveryFee = orderType === "DELIVERY" ? 5.0 : 0;
      const total = subtotal + tax + deliveryFee;

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          type: orderType,
          subtotal,
          tax,
          deliveryFee,
          total,
          address: addressId,
          items: {
            create: orderItemsToCreate,
          },
          logs: {
            create: {
              status: "PENDING",
              note: "Order initialized via secure checkout",
            },
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Clear user cart if authenticated
      if (userId) {
        await tx.cartItem.deleteMany({ where: { userId } });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Secure Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Order submission failed" },
      { status: 500 }
    );
  }
}
