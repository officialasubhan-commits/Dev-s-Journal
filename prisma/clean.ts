import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting cleanup of testing/demo content...");
  
  // Delete generated content
  const deletedMessages = await prisma.message.deleteMany();
  console.log(`Deleted ${deletedMessages.count} messages.`);
  
  const deletedNotifications = await prisma.notification.deleteMany();
  console.log(`Deleted ${deletedNotifications.count} notifications.`);
  
  const deletedTestimonials = await prisma.testimonial.deleteMany();
  console.log(`Deleted ${deletedTestimonials.count} testimonials.`);
  
  const deletedFaqs = await prisma.fAQ.deleteMany();
  console.log(`Deleted ${deletedFaqs.count} FAQs.`);
  
  const deletedSkills = await prisma.skill.deleteMany();
  console.log(`Deleted ${deletedSkills.count} skills.`);
  
  const deletedGallery = await prisma.galleryImage.deleteMany();
  console.log(`Deleted ${deletedGallery.count} gallery images.`);
  
  const deletedCerts = await prisma.certification.deleteMany();
  console.log(`Deleted ${deletedCerts.count} certifications.`);
  
  // Course and cascading relations (Lessons, Sections, Reviews will cascade or we can delete them explicitly)
  await prisma.lesson.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.review.deleteMany();
  const deletedCourses = await prisma.course.deleteMany();
  console.log(`Deleted ${deletedCourses.count} courses (and related lessons/sections/reviews).`);
  
  const deletedProjects = await prisma.project.deleteMany();
  console.log(`Deleted ${deletedProjects.count} projects.`);
  
  // Posts and their relations (Comments, etc)
  await prisma.comment.deleteMany();
  const deletedPosts = await prisma.post.deleteMany();
  console.log(`Deleted ${deletedPosts.count} posts.`);
  
  const deletedCategories = await prisma.category.deleteMany();
  console.log(`Deleted ${deletedCategories.count} categories.`);

  // Additional models that might contain fake testing data
  await prisma.book.deleteMany();
  await prisma.userLearning.deleteMany();
  await prisma.album.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.draft.deleteMany();

  // Reset arrays in settings that might hold references to deleted entities
  await prisma.homepageSettings.updateMany({
    data: {
      featuredProjects: [],
      featuredPosts: [],
      featuredCertificates: [],
      featuredCourses: []
    }
  });

  await prisma.courseSettings.updateMany({
    data: {
      homepageFeaturedCourses: []
    }
  });

  await prisma.certificateSettings.updateMany({
    data: {
      homepageFeaturedCertificates: []
    }
  });

  await prisma.gallerySettings.updateMany({
    data: {
      featuredImages: []
    }
  });

  console.log("Cleanup complete. All testing content removed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
