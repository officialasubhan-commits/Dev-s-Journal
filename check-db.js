require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const userCount = await prisma.user.count();
  console.log('Total users:', userCount);
  
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  console.log('Admin user:', admin ? admin.email : 'NONE');
  
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  console.log('SiteSettings:', settings ? 'EXISTS' : 'MISSING');
  
  if (!settings) {
    console.log('Creating SiteSettings singleton...');
    await prisma.siteSettings.create({ data: { id: 'singleton' } });
    console.log('SiteSettings created!');
  }
  
  if (!admin) {
    console.log('No admin user found! Running seed...');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
