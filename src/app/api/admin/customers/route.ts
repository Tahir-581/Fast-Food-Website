import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        _count: {
          select: { orders: true }
        },
        orders: {
          select: { total: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCustomers = customers.map((c: any) => {
      const totalSpent = c.orders.reduce((sum: number, o: any) => sum + o.total, 0);
      let status = 'Regular';
      if (totalSpent > 500 || c.sparks > 1000) status = 'VIP';
      if (c._count.orders === 0) status = 'New';

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        orders: c._count.orders,
        totalSpent,
        status,
        sparks: c.sparks
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error("Admin customers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
