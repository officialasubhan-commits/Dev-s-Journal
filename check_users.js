const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  console.log("USERS:", users);
  
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bossjournal.com";
  const bcrypt = require('bcryptjs');
  const password = process.env.ADMIN_PASSWORD || "supersecretpassword";
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      name: "Administrator",
      username: "admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    }
  });
  
  console.log("Admin ensured:", adminUser.email);
}
main().finally(() => prisma.$disconnect());
