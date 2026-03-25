import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Total Revenue (Completed Orders)
    const completedOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' }, // Or however we define "completed"
      select: { total: true }
    });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // 2. Order Counts
    const totalOrdersCount = await prisma.order.count();
    const pendingOrdersCount = await prisma.order.count({ where: { status: 'PENDING' } });

    // 3. User Count
    const totalUsersCount = await prisma.user.count({ where: { role: 'USER' } });

    // 4. Sales by Category (Simple aggregation)
    const categoriesWithSales = await prisma.category.findMany({
      include: {
        products: {
          include: {
            _count: {
              select: { orderItems: true }
            }
          }
        }
      }
    });

    const categoryStats = categoriesWithSales.map(cat => ({
      name: cat.name,
      orderCount: cat.products.reduce((sum, p) => sum + p._count.orderItems, 0)
    }));

    // 5. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        totalUsersCount,
      },
      categoryStats,
      recentOrders
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
