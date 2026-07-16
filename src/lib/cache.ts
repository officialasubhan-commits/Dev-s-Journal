import prisma from "./prisma";
import { unstable_cache } from "next/cache";

// 1. Site Settings Cache
export const getCachedSettings = unstable_cache(
  async () => {
    let brand = await prisma.brandSettings.findUnique({ where: { id: "singleton" } });

    if (!brand) {
      try {
        await Promise.all([
          prisma.brandSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.seoSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.homepageSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.aboutSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.contactSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.courseSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.certificateSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.notificationSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.gallerySettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.footerSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.generalSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          }),
          prisma.maintenanceSettings.upsert({
            where: { id: "singleton" },
            update: {},
            create: { id: "singleton" }
          })
        ]);
        brand = await prisma.brandSettings.findUnique({ where: { id: "singleton" } });
      } catch (error: any) {
        if (error.code !== 'P2002') {
          console.error("Settings initialization error in cache:", error);
        }
      }
    }

    const [
      seo,
      homepage,
      about,
      contact,
      course,
      certificate,
      notification,
      gallery,
      footer,
      general,
      maintenance
    ] = await Promise.all([
      prisma.seoSettings.findUnique({ where: { id: "singleton" } }),
      prisma.homepageSettings.findUnique({ where: { id: "singleton" } }),
      prisma.aboutSettings.findUnique({ where: { id: "singleton" } }),
      prisma.contactSettings.findUnique({ where: { id: "singleton" } }),
      prisma.courseSettings.findUnique({ where: { id: "singleton" } }),
      prisma.certificateSettings.findUnique({ where: { id: "singleton" } }),
      prisma.notificationSettings.findUnique({ where: { id: "singleton" } }),
      prisma.gallerySettings.findUnique({ where: { id: "singleton" } }),
      prisma.footerSettings.findUnique({ where: { id: "singleton" } }),
      prisma.generalSettings.findUnique({ where: { id: "singleton" } }),
      prisma.maintenanceSettings.findUnique({ where: { id: "singleton" } })
    ]);

    return {
      brand,
      seo,
      homepage,
      about,
      contact,
      course,
      certificate,
      notification,
      gallery,
      footer,
      general,
      maintenance
    };
  },
  ["site-settings"],
  {
    tags: ["site-settings"]
  }
);

// 2. Homepage Data Cache
export const getCachedHomepageData = (projectIds: string[], postIds: string[]) => unstable_cache(
  async () => {
    const [
      featuredProjects,
      latestPosts,
      learningProgress,
      galleryImages,
      totalPosts,
      totalProjects,
      totalCourses,
      totalGallery
    ] = await Promise.all([
      prisma.project.findMany({
        where: projectIds.length > 0 ? { id: { in: projectIds } } : { published: true },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          technologies: true,
        }
      }),
      prisma.post.findMany({
        where: postIds.length > 0 ? { id: { in: postIds } } : { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          readingTime: true,
        }
      }),
      prisma.userLearning.findMany({
        orderBy: { progress: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          platform: true,
          progress: true,
        }
      }),
      prisma.galleryImage.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          url: true,
          caption: true,
        }
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.userLearning.count(),
      prisma.galleryImage.count()
    ]);

    return {
      featuredProjects,
      latestPosts,
      learningProgress,
      galleryImages,
      totalPosts,
      totalProjects,
      totalCourses,
      totalGallery
    };
  },
  ["homepage-data", JSON.stringify(projectIds), JSON.stringify(postIds)],
  {
    tags: ["homepage-data"]
  }
)();

// 3. Courses List Cache
export const getCachedCoursesList = unstable_cache(
  async () => {
    return await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        instructor: true,
        shortDescription: true,
        coverImage: true,
        difficulty: true,
        category: true,
        tags: true,
        duration: true,
        lessonsCount: true,
        rating: true,
        studentsCount: true,
        language: true,
        isFree: true,
        price: true,
        discountPrice: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
  ["courses-list"],
  {
    tags: ["courses-list"]
  }
);

// 4. Certifications List Cache
export const getCachedCertificationsList = unstable_cache(
  async () => {
    return await prisma.certification.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        title: true,
        issuer: true,
        date: true,
        url: true,
        image: true,
        pdfUrl: true,
        skills: true,
        published: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  },
  ["certifications-list"],
  {
    tags: ["certifications-list"]
  }
);

// 5. Projects List Cache
export const getCachedProjectsList = unstable_cache(
  async () => {
    return await prisma.project.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        technologies: true,
        githubUrl: true,
        liveUrl: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },
  ["projects-list"],
  {
    tags: ["projects-list"]
  }
);

// 6. Posts List Cache
export const getCachedPostsList = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        readingTime: true,
        tags: true,
        content: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },
  ["posts-list"],
  {
    tags: ["posts-list"]
  }
);

// 7. About Page Data Cache
export const getCachedAboutPageData = unstable_cache(
  async () => {
    const [admin, postsCount, projectsCount, photosCount] = await Promise.all([
      prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: {
          id: true,
          name: true,
          displayName: true,
          biography: true,
          shortIntroduction: true,
          skills: true,
          technologies: true,
          spokenLanguages: true,
          languages: true,
          image: true,
          occupation: true,
          company: true,
          course: true,
          college: true,
          city: true,
          state: true,
          country: true
        }
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.galleryImage.count()
    ]);

    return {
      admin,
      postsCount,
      projectsCount,
      photosCount
    };
  },
  ["about-page-data"],
  {
    tags: ["about-page-data"]
  }
);
