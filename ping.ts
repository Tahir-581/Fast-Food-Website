import prisma from './src/lib/db';

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('Connection successful! User count:', userCount);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
