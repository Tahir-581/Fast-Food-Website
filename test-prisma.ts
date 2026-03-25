import prisma from "./src/lib/db";

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log("Categories:", categories);
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
