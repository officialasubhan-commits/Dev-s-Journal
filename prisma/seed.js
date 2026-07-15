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

  const hashedPassword = await bcrypt.hash(password, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
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

  // Seed default modular settings
  await prisma.brandSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitle: "Boss Journal",
      siteTagline: "My personal portfolio, journal, and digital headquarters.",
      siteDescription: "My personal portfolio, journal, and digital headquarters.",
      siteLogo: "",
      siteFavicon: "",
      siteUrl: "http://localhost:3000",
    }
  });

  await prisma.generalSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      authorName: "Abdus Subhan",
      authorEmail: email,
      enableComments: true,
      enableGallery: true,
      enableLearning: true,
      enableNotifications: true,
    }
  });

  await prisma.contactSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      contactEmail: email,
      availabilityStatus: "Available",
      contactHeading: "Get In Touch",
      contactDescription: "Have a project in mind, want to collaborate, or just want to say hi? Send me a message!",
      githubUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      discordUsername: "",
      telegramUsername: "",
    }
  });

  await prisma.homepageSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroTitle: "Designing simple, warm & premium digital experiences.",
      heroHighlighted: "warm & premium",
      heroDescription: "I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.",
      heroProfileImage: "",
      heroBgDecor: "glow",
      heroBtnPrimaryText: "Explore Projects",
      heroBtnPrimaryLink: "/projects",
      heroBtnSecondaryText: "Read Journal",
      heroBtnSecondaryLink: "/journal",
      authorTitle: "Software Engineer & UI/UX Designer",
      authorBio: "Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.",
      featuredProjects: [],
      featuredPosts: [],
      featuredCertificates: [],
      featuredCourses: []
    }
  });

  console.log(`Admin user and site settings seeded successfully for: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
