import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "daily";

    // Simplified analytics: Sum of totals grouped by day
    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      select: { total: true, createdAt: true },
    });

    // In a real app, this would be a more complex SQL aggregation
    const revenueByDay = orders.reduce((acc: any, order: { total: number; createdAt: Date }) => {
      const date = order.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    const labels = Object.keys(revenueByDay).sort();
    const data = labels.map((label) => revenueByDay[label]);

    return NextResponse.json({
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
        },
      ],
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
