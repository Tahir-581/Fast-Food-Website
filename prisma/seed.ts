import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});


async function main() {
  console.log('--- Initializing Midnight & Ember Premium Seed ---');

  // 1. Clean Database
  await prisma.fulfillmentLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.modifierOption.deleteMany();
  await prisma.modifierGroup.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.setting.deleteMany();

  // 2. Users & Roles
  const adminPassword = await bcrypt.hash('Admin@Midnight2026', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'concierge@midnightember.com',
      passwordHash: adminPassword,
      name: 'Midnight Concierge',
      role: 'ADMIN',
      loyaltyTier: 'FLAME',
      sparks: 5000,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'guest@example.com',
      passwordHash: userPassword,
      name: 'Alex Sterling',
      role: 'USER',
      loyaltyTier: 'SPROUT',
      sparks: 150,
    },
  });

  // 3. Categories
  const categories = [
    { name: 'The Collection', slug: 'burgers', sortOrder: 1, imageUrl: '/assets/categories/burgers.jpg' },
    { name: 'Accoutrements', slug: 'sides', sortOrder: 2, imageUrl: '/assets/categories/sides.jpg' },
    { name: 'Elixirs', slug: 'drinks', sortOrder: 3, imageUrl: '/assets/categories/drinks.jpg' },
    { name: 'Finishes', slug: 'desserts', sortOrder: 4, imageUrl: '/assets/categories/desserts.jpg' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  // 4. Products & Modifiers
  
  // A. Midnight Wagyu
  const wagyu = await prisma.product.create({
    data: {
      categoryId: categoryMap['burgers'],
      name: 'The Midnight Wagyu',
      slug: 'midnight-wagyu',
      description: 'Double A5 wagyu blend, activated charcoal brioche, truffle-infused aioli, and 24-month aged cheddar.',
      basePrice: 22.00,
      calories: 920,
      dietaryTags: 'PREMIUM, HOUSE_SPECIAL',
      imageUrl: '/assets/products/wagyu-burger.jpg',
      modifierGroups: {
        create: [
          {
            name: 'Temperature',
            isRequired: true,
            minSelection: 1,
            maxSelection: 1,
            options: {
              create: [
                { name: 'Medium Rare', isDefault: true },
                { name: 'Medium' },
                { name: 'Medium Well' },
              ]
            }
          },
          {
            name: 'Enhancements',
            isRequired: false,
            minSelection: 0,
            maxSelection: 3,
            options: {
              create: [
                { name: 'Truffle Glazed Bacon', priceModifier: 4.50 },
                { name: 'Gold Leaf Flakes', priceModifier: 12.00, stock: 50 },
                { name: 'Caramelized Bone Marrow', priceModifier: 6.00 },
              ]
            }
          }
        ]
      }
    }
  });

  // B. Ember Chicken
  await prisma.product.create({
    data: {
      categoryId: categoryMap['burgers'],
      name: 'The Ember Spiced Chicken',
      slug: 'ember-chicken',
      description: 'Nashville-inspired hot chicken, house-made ember honey, fermented pickle slaw, and toasted sesame bun.',
      basePrice: 16.50,
      calories: 780,
      dietaryTags: 'SPICY',
      imageUrl: '/assets/products/ember-chicken.jpg',
    }
  });

  // C. Truffle Fries
  await prisma.product.create({
    data: {
      categoryId: categoryMap['sides'],
      name: 'Charcoal Truffle Fries',
      slug: 'charcoal-fries',
      description: 'Hand-cut russet potatoes, activated charcoal infusion, white truffle oil, and pecorino romano.',
      basePrice: 9.00,
      calories: 450,
      dietaryTags: 'VEGETARIAN',
      imageUrl: '/assets/products/truffle-fries.jpg',
    }
  });

  // 5. Coupons
  await prisma.coupon.create({
    data: {
      code: 'IGNITE2026',
      type: 'PERCENT',
      value: 15,
      minOrderValue: 40,
      expiresAt: new Date('2026-12-31'),
    }
  });

  // 6. Settings
  await prisma.setting.createMany({
    data: [
      { key: 'store_status', value: 'OPEN' },
      { key: 'delivery_radius_km', value: '15' },
      { key: 'concierge_fee', value: '5.00' },
      { key: 'support_email', value: 'concierge@midnightember.com' },
    ]
  });

  console.log('--- Seed Complete: Platform Ready for Operations ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
