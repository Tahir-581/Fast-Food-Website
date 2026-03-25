import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const dietary = searchParams.get('dietary'); // Comma separated: VEGAN,SPICY
    const search = searchParams.get('search');

    const where: any = { isActive: true };

    if (categorySlug) {
      where.slug = categorySlug;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        products: {
          where: {
            isAvailable: true,
            AND: [
              search ? {
                OR: [
                  { name: { contains: search } },
                  { description: { contains: search } }
                ]
              } : {},
              dietary ? {
                dietaryTags: { contains: dietary }
              } : {}
            ]
          },
          include: {
            modifierGroups: {
              include: {
                options: {
                  where: { isAvailable: true }
                }
              }
            },
            inventory: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Menu discovery error:', error);
    return NextResponse.json(
      { message: 'Failed to discover the menu. Please try again.' },
      { status: 500 }
    );
  }
}
