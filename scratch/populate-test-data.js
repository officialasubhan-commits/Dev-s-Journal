const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding realistic test data...");

  // Find Admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.error("Error: Admin user not found. Run seed script first.");
    process.exit(1);
  }

  console.log(`Seeding data for admin: ${admin.email} (${admin.id})`);

  // Clear existing items to prevent duplicates while preserving database structure
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.userAchievement.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.galleryImage.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.notification.deleteMany({
    where: {
      userId: admin.id,
      id: { not: "welcome-seeded" } // Preserve initial seed notification if any
    }
  });

  // 1. Categories
  const softwareCat = await prisma.category.create({
    data: { name: "Software Engineering", slug: "software-engineering" }
  });
  const webDevCat = await prisma.category.create({
    data: { name: "Web Development", slug: "web-development" }
  });
  const devopsCat = await prisma.category.create({
    data: { name: "DevOps", slug: "devops" }
  });

  // 2. 5 Journal Posts
  const postsData = [
    {
      title: "Architecting a Scalable Next.js Application with Clean Architecture",
      slug: "nextjs-clean-architecture-guide",
      content: "<p>Designing enterprise-scale web applications requires separating business rules from framework implementation patterns. Next.js 16 provides features like Server Components and programmatically handled Server Actions that align nicely with Clean Architecture paradigms.</p><p>We structure our application into <strong>Domain</strong> (entities, use cases), <strong>Adapter</strong> (Prisma, custom Fetch APIs), and <strong>Presentation</strong> (React UI, dynamic hooks) directories. This guarantees that if we swap Next.js for another frame, the business logic remains untouched.</p>",
      readingTime: 6,
      mood: "productive",
      tags: ["Next.js", "Architecture", "Design Patterns", "Clean Code"],
      published: true,
      seoTitle: "Scalable Next.js 16 Applications with Clean Architecture Guide",
      seoDescription: "A practical guide to implementing Clean Architecture in enterprise Next.js applications using React Server Components.",
      categoryId: softwareCat.id,
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Mastering Prisma ORM: Advanced Relationships, Indexes, and Query Optimization",
      slug: "mastering-prisma-orm-advanced-query-optimization",
      content: "<p>Prisma simplifies database interactions for TypeScript developers, but poor relationship models or missing database indexes can cause queries to slow down on large datasets.</p><p>To optimize queries, configure compound indices for lookup fields, implement strict client limits using connection pooling settings, and leverage Prisma's <code>select</code> clause to query only required columns instead of pulling whole rows.</p>",
      readingTime: 8,
      mood: "analytical",
      tags: ["Prisma", "PostgreSQL", "Database", "Backend"],
      published: true,
      seoTitle: "Mastering Prisma Query Optimization and Indexing Guide",
      seoDescription: "Unlock full database performance with complex query optimization, relational indexing, and database pool management in Prisma ORM.",
      categoryId: softwareCat.id,
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Demystifying NextAuth.js: Custom Credentials, Two-Factor Auth, and Session Security",
      slug: "demystifying-nextauth-session-security-and-2fa",
      content: "<p>Security is the foundation of any modern portal. Using NextAuth.js (v4), we can orchestrate clean custom Credentials authentication alongside strict Role-Based Access Control and multi-factor validation flows.</p><p>By securing JWT tokens via encryption keys and managing token expiry with sliding sessions, we prevent malicious credential re-use and keep administrative endpoints locked down.</p>",
      readingTime: 7,
      mood: "inspired",
      tags: ["Security", "Authentication", "NextAuth", "MFA"],
      published: true,
      seoTitle: "Secure NextAuth.js and Two-Factor Authentication Strategy",
      seoDescription: "Learn to build multi-factor authentication, secure session tokens, and verify credential inputs in NextAuth v4.",
      categoryId: webDevCat.id,
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Optimizing Tailwind CSS for Enterprise-Scale Performance and Design Systems",
      slug: "optimizing-tailwind-css-enterprise-design-systems",
      content: "<p>Tailwind CSS makes rapid UI adjustments effortless, but uncontrolled styling values can lead to inconsistencies inside large teams.</p><p>We build our design system using customized HSL values in <code>tailwind.config.ts</code>. This allows us to shift light and dark color schemes smoothly by changing body CSS variables while keeping compiled build sizes tiny through purge rules.</p>",
      readingTime: 5,
      mood: "creative",
      tags: ["Tailwind", "CSS", "Design Systems", "UIUX"],
      published: true,
      seoTitle: "Designing Enterprise Design Systems using Tailwind CSS",
      seoDescription: "A deep dive into Tailwind configuration, semantic variables, dark mode styling, and utility pruning.",
      categoryId: webDevCat.id,
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Continuous Integration & Deployment (CI/CD) on Vercel: Secrets, Preview Branches, and Edge Functions",
      slug: "ci-cd-vercel-secrets-preview-branches-edge-functions",
      content: "<p>Automating your shipping pipeline guarantees code updates go live confidently. We review setting up secure secrets, configuring staging preview builds for pull requests, and setting up Edge routing rules.</p><p>Vercel's tight integration with GitHub handles static caching automatically, triggering page regeneration loops upon new commits.</p>",
      readingTime: 6,
      mood: "excited",
      tags: ["DevOps", "Vercel", "CI-CD", "Edge Computing"],
      published: true,
      seoTitle: "Setting Up Production CI/CD Pipeline on Vercel Engine",
      seoDescription: "Automate code deployments, preview branch generation, environment secret injections, and edge worker configs on Vercel.",
      categoryId: devopsCat.id,
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600"
    }
  ];

  for (const post of postsData) {
    await prisma.post.create({ data: post });
  }
  console.log("Seeded 5 Journal Posts");

  // 3. 5 Projects
  const projectsData = [
    {
      title: "Boss Journal Portfolio Control Center",
      slug: "boss-journal-portfolio-control-center",
      description: "A complete personal administration, analytics, and content studio dashboard built with Next.js 16 and Prisma.",
      content: "Created to replace scattered admin tasks. It features visual content creation, automated image cropping tools with direct Cloudinary storage pipelines, real-time message handling, and page-traffic metrics.",
      features: "Real-time notifications, unified content studio editor, database backups, automated analytics charts.",
      challenges: "Synchronizing uncontrolled rich text values, handling asynchronous event cleanups in React, preventing layout shifts.",
      lessonsLearned: "Capturing synchronous synthetic event references inside React closures before awaiting asynchronous actions resolves event nullification issues.",
      technologies: ["Next.js", "React", "Prisma", "Tailwind CSS", "PostgreSQL", "Cloudinary"],
      githubUrl: "https://github.com/officialasubhan-commits/Dev-s-Journal",
      liveUrl: "https://boss-journal.vercel.app",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"],
      published: true,
      pinned: true,
      authorId: admin.id
    },
    {
      title: "Sentinel: Distributed Authentication Gateway",
      slug: "sentinel-distributed-authentication-gateway",
      description: "A highly secure credentials validation service with built-in multi-factor authorization and IP rate-limiting.",
      content: "Sentinel acts as an authorization buffer between user apps and backend systems. It manages token encryption, sliding tokens, user lockouts on consecutive failed attempts, and MFA generation.",
      features: "MFA generation/verification, Redis rate-limiting, secure token rotation, email validation hooks.",
      challenges: "Managing rate-limiting counters across multiple node processes without adding query latency.",
      lessonsLearned: "Implementing Redis memory storage arrays keeps validation speed under 5ms.",
      technologies: ["Node.js", "TypeScript", "Redis", "Docker", "JWT", "PostgreSQL"],
      githubUrl: "https://github.com/officialasubhan-commits/sentinel-gateway",
      liveUrl: "https://sentinel-gateway.demo",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
      published: true,
      authorId: admin.id
    },
    {
      title: "Helios: Solar Array Monitoring Platform",
      slug: "helios-solar-array-monitoring-platform",
      description: "Real-time energy generation tracking showing weather adjustments, efficiency charts, and hardware notifications.",
      content: "Helios handles streaming metrics from green energy grids. It processes real-time inputs to graph generation speeds, efficiency rates, and highlights panel failures immediately.",
      features: "WebSockets telemetry feed, automated performance metrics charts, solar efficiency logs.",
      challenges: "Processing high-frequency streaming inputs without triggering render lockouts on the dashboard UI.",
      lessonsLearned: "Using canvas-drawn lines and chart data downsampling stabilizes render performance.",
      technologies: ["React", "Python", "FastAPI", "WebSockets", "Chart.js", "Tailwind CSS"],
      githubUrl: "https://github.com/officialasubhan-commits/helios-solar",
      liveUrl: "https://helios.solar",
      coverImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
      published: true,
      authorId: admin.id
    },
    {
      title: "Apex: E-Commerce Storefront Engine",
      slug: "apex-ecommerce-storefront-engine",
      description: "Ultra-fast headless commerce template using static generation, incremental regeneration, and server components.",
      content: "Designed for high conversion performance. Features fully dynamic product filters, shopping cart synchronization, and Stripe checkout checkouts.",
      features: "Headless commerce APIs, incremental site regeneration, Stripe checkout integration.",
      challenges: "Keeping inventory counters accurate across highly cached pages during concurrent purchase updates.",
      lessonsLearned: "Using Next.js revalidation routes handles inventory display changes correctly.",
      technologies: ["Next.js", "GraphQL", "Stripe", "Prisma", "Tailwind CSS", "PostgreSQL"],
      githubUrl: "https://github.com/officialasubhan-commits/apex-shop",
      liveUrl: "https://apex-shop.store",
      coverImage: "https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&q=80&w=600",
      published: true,
      authorId: admin.id
    },
    {
      title: "Novis: Collaborative Note-Taking Canvas",
      slug: "novis-collaborative-note-taking-canvas",
      description: "Real-time interactive editor supporting rich markdown, block structures, dynamic code execution, and team syncing.",
      content: "Designed for engineering teams to coordinate plans, edit markdown code, write documentation, and save code snippets simultaneously.",
      features: "Real-time co-authoring, collaborative scroll, dynamic code sandbox output rendering.",
      challenges: "Resolving data collision issues when multiple users edit the exact same document line.",
      lessonsLearned: "Using Conflict-free Replicated Data Types (CRDTs) manages simultaneous edits cleanly.",
      technologies: ["Next.js", "Yjs", "WebSockets", "Tailwind CSS", "Tiptap", "Prisma"],
      githubUrl: "https://github.com/officialasubhan-commits/novis-notes",
      liveUrl: "https://novis-notes.canvas",
      coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
      published: true,
      authorId: admin.id
    }
  ];

  for (const project of projectsData) {
    await prisma.project.create({ data: project });
  }
  console.log("Seeded 5 Projects");

  // 4. 5 Gallery Items (Album + Gallery Images)
  const album = await prisma.album.create({
    data: {
      title: "System Architectures & UI Blueprints",
      description: "Visual blueprints, database schema charts, and design layouts.",
      coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
      userId: admin.id
    }
  });

  const galleryImagesData = [
    {
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
      caption: "Sentinel Gateway Security Topology Map",
      authorId: admin.id,
      albumId: album.id
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      caption: "Boss Journal Analytics Dashboard Layout Draft",
      authorId: admin.id,
      albumId: album.id
    },
    {
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
      caption: "Novis Canvas Markdown Component Hierarchy Structure",
      authorId: admin.id,
      albumId: album.id
    },
    {
      url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600",
      caption: "Tailwind Design System Theme Tokens Specification Sheet",
      authorId: admin.id,
      albumId: album.id
    },
    {
      url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600",
      caption: "PostgreSQL Prisma Relationship Graph Schema View",
      authorId: admin.id,
      albumId: album.id
    }
  ];

  for (const img of galleryImagesData) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log("Seeded 5 Gallery Images");

  // 5. 5 Learning Entries (Courses, Books, Certifications)
  // Courses
  await prisma.course.create({
    data: {
      title: "Advanced Next.js Design Patterns",
      platform: "Frontend Masters",
      progress: 100,
      status: "COMPLETED",
      completedAt: new Date(),
      userId: admin.id
    }
  });
  await prisma.course.create({
    data: {
      title: "SQL Performance Tuning for PostgreSQL",
      platform: "Udemy",
      progress: 80,
      status: "IN_PROGRESS",
      userId: admin.id
    }
  });

  // Books
  await prisma.book.create({
    data: {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      status: "READING",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      userId: admin.id
    }
  });
  await prisma.book.create({
    data: {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      status: "COMPLETED",
      rating: 5,
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
      userId: admin.id
    }
  });

  // Certifications
  await prisma.certification.create({
    data: {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: new Date("2026-01-15"),
      url: "https://aws.amazon.com/certification",
      userId: admin.id
    }
  });
  console.log("Seeded 5 Learning Entries");

  // 6. 5 Notifications
  const notificationsData = [
    {
      userId: admin.id,
      type: "ANNOUNCEMENT",
      title: "👋 Welcome to Boss Journal!",
      message: "Welcome to my personal portfolio and learning journal.",
      link: "/",
      published: true,
      priority: "MEDIUM"
    },
    {
      userId: admin.id,
      type: "SUCCESS",
      title: "🎉 Portfolio system fully updated to Next.js 16!",
      message: "All dynamic server routes and state sync flows are fully production ready.",
      link: "/",
      published: true,
      priority: "MEDIUM"
    },
    {
      userId: admin.id,
      type: "WARNING",
      title: "⚠️ Database maintenance scheduled",
      message: "Neon server optimization will run in the background in 24 hours.",
      link: "/admin/analytics",
      published: true,
      pinned: true,
      priority: "HIGH"
    },
    {
      userId: admin.id,
      type: "INFO",
      title: "💡 Interactive image cropping active",
      message: "You can now crop your banners directly in the Media Studio before saving.",
      link: "/admin/gallery",
      published: true,
      priority: "LOW"
    },
    {
      userId: admin.id,
      type: "ANNOUNCEMENT",
      title: "📝 Preview: New course updates coming soon",
      message: "Draft notes on AWS architecture strategies will go live shortly.",
      link: "/admin/learning",
      published: false,
      priority: "MEDIUM"
    }
  ];

  for (const notif of notificationsData) {
    await prisma.notification.create({ data: notif });
  }
  console.log("Seeded 5 Notifications");

  // 7. 5 Skills
  const skillsData = [
    { name: "TypeScript", category: "Frontend", proficiency: 95, userId: admin.id },
    { name: "React & Next.js 16", category: "Frontend", proficiency: 95, userId: admin.id },
    { name: "Node.js & Express", category: "Backend", proficiency: 90, userId: admin.id },
    { name: "PostgreSQL & Prisma", category: "Backend", proficiency: 88, userId: admin.id },
    { name: "Docker & CI/CD", category: "Tools", proficiency: 80, userId: admin.id }
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log("Seeded 5 Skills");

  // 8. 5 Achievements / Timeline
  const achievementsData = [
    { title: "Graduated with Honors in Computer Science", description: "Finished top of the class with specialization in software engineering paradigms." },
    { title: "Contributed to Major Open Source Auth Library", description: "Fixed session synchronization edge cases inside NextAuth credentials verification loop." },
    { title: "AWS Solutions Architect Certified", description: "Cleared AWS Certified Solutions Architect Associate exam with a high score." },
    { title: "Launched Helios Solar Tracker Platform", description: "System is now actively used across three regional solar grids." },
    { title: "Joined Boss Journal Core Development", description: "Took charge of full stack systems and advanced analytics design." }
  ];

  for (const ach of achievementsData) {
    const dbAch = await prisma.achievement.create({ data: ach });
    await prisma.userAchievement.create({
      data: {
        userId: admin.id,
        achievementId: dbAch.id,
        unlockedAt: new Date()
      }
    });
  }
  console.log("Seeded 5 Timeline Achievements");

  console.log("Successfully seeded all realistic test data!");
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
