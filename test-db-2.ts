import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Testing with variable name "db"...');
  try {
    const count = await db.user.count();
    console.log(`Success. Count: ${count}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.$disconnect();
  }
}

main();
