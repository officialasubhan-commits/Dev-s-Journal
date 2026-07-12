/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`DROP TABLE IF EXISTS _prisma_migrations`;
  console.log("Dropped _prisma_migrations");
  process.exit(0);
}

main().catch(console.error);
