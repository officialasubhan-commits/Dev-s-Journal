/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Error: ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables.");
    return;
  }

  const adminCount = await prisma.user.count({
    where: { role: 'ADMIN' }
  });

  if (adminCount > 0) {
    console.log("Admin user already exists. Seed skipped.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const adminUser = await prisma.user.create({
    data: {
      name: "Administrator",
      username: "admin",
      email: email,
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create welcome notification
  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      type: "SYSTEM",
      title: "Welcome to your Digital Home!",
      message: "Your administrator account has been successfully seeded. You can now configure your portfolio.",
      link: "/admin/dashboard",
    },
  });

  console.log(`Admin user created successfully: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
