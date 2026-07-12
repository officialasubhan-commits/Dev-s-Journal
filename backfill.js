/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) {
    await prisma.post.updateMany({ where: { authorId: null }, data: { authorId: admin.id } });
    await prisma.project.updateMany({ where: { authorId: null }, data: { authorId: admin.id } });
    await prisma.galleryImage.updateMany({ where: { authorId: null }, data: { authorId: admin.id } });
    console.log('Backfilled authorIds');
  }
}
main().finally(() => prisma.$disconnect());
