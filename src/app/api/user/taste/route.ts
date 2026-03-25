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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tasteProfile: true }
    });

    return NextResponse.json(user?.tasteProfile ? JSON.parse(user.tasteProfile) : {});
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch taste profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await req.json();
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { tasteProfile: JSON.stringify(profile) }
    });

    return NextResponse.json({ message: "Taste profile updated" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update taste profile" }, { status: 500 });
  }
}
