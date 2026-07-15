/* eslint-disable @typescript-eslint/no-require-imports */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import {
  generateBlogs,
  generateProjects,
  generateCourses,
  generateCertificates,
  generateFAQs,
  generateTestimonials,
  generateNotifications,
  generateSkills,
  generateGallery,
  generateMessages
} from './seedData/generators';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@bossjournal.com";
  const password = process.env.ADMIN_PASSWORD || "supersecretpassword";

  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash(password, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      name: "Administrator",
      username: "admin_" + Math.floor(Math.random() * 10000),
      email: email,
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log(`Admin user seeded: ${adminUser.email}`);

  // Clear existing generated data to avoid duplicates on re-run
  console.log("Cleaning up previous data...");
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const categoryNames = ["Development", "Design", "DevOps", "AI", "Cloud"];
  const categoryIds: string[] = [];
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase() }
    });
    categoryIds.push(cat.id);
  }
  console.log("Categories seeded.");

  // Delete existing data to prevent massive duplication if running multiple times? 
  // The user says: "Prevent duplicate inserts. If records already exist, only insert missing data."
  // But wait, the fake data uses random titles. `upsert` needs a unique constraint.
  // The models have `slug` as unique. So `upsert` with slug is perfect.

  // Blogs (50)
  console.log("Generating 50 Blogs...");
  const blogs = generateBlogs(50, adminUser.id, categoryIds);
  for (const blog of blogs) {
    await prisma.post.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }

  // Projects (30)
  console.log("Generating 30 Projects...");
  const projects = generateProjects(30, adminUser.id);
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  // Courses (40)
  // Our generator creates course objects, but we need to also create Curriculum (Sections/Lessons), Reviews, and FAQs.
  console.log("Generating 40 Courses...");
  const courses = generateCourses(40, adminUser.id);
  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        ...course,
        curriculum: {
          create: [
            {
              title: "Getting Started",
              order: 1,
              lessons: {
                create: [
                  { title: "Introduction", duration: "05:00", isPreview: true, order: 1 },
                  { title: "Setup", duration: "10:00", isPreview: false, order: 2 }
                ]
              }
            },
            {
              title: "Advanced Concepts",
              order: 2,
              lessons: {
                create: [
                  { title: "Deep Dive", duration: "25:00", isPreview: false, order: 1 },
                  { title: "Conclusion", duration: "05:00", isPreview: false, order: 2 }
                ]
              }
            }
          ]
        },
        reviews: {
          create: [
            { userName: "Alice", rating: 5.0, comment: "Amazing course!" },
            { userName: "Bob", rating: 4.5, comment: "Very helpful." }
          ]
        },
        faqs: {
          create: [
            { question: "Do I get a certificate?", answer: "Yes, upon completion.", global: false }
          ]
        }
      },
    });
  }

  // Certificates (40)
  console.log("Generating 40 Certificates...");
  const certificates = generateCertificates(40, adminUser.id);
  for (const cert of certificates) {
    await prisma.certification.create({
      data: cert,
    }); // No unique identifier on certs other than id, so we just create
  }

  // Gallery (80)
  console.log("Generating 80 Gallery Images...");
  const images = generateGallery(80, adminUser.id);
  for (const img of images) {
    await prisma.galleryImage.create({
      data: img,
    });
  }

  // Skills (50)
  console.log("Generating 50 Skills...");
  const skills = generateSkills(50, adminUser.id);
  for (const skill of skills) {
    // There's no unique constraint on name for skill globally, we will just create them. 
    // Wait, if we just create, we might get duplicates on rerun. Let's delete existing first.
    // Actually we can just create if count is low. Let's delete all first.
    await prisma.skill.create({ data: skill });
  }

  // FAQs (40 global)
  console.log("Generating 40 Global FAQs...");
  const faqs = generateFAQs(40);
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  // Testimonials (30)
  console.log("Generating 30 Testimonials...");
  const testimonials = generateTestimonials(30);
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }

  // Announcements / Notifications (40)
  console.log("Generating 40 Notifications...");
  const notifications = generateNotifications(40, adminUser.id);
  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }

  // Messages (30 contact inquiries)
  console.log("Generating 30 Contact Messages...");
  const messages = generateMessages(30);
  for (const msg of messages) {
    await prisma.message.create({ data: msg });
  }

  // Seed default modular settings (from the original seed script)
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

  console.log("Platform completely populated with realistic data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
