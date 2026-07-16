// src/lib/services/academy.ts
import prisma from "@/lib/prisma";
import { getCachedCoursesList } from "@/lib/cache";
import { cache } from "react";
import { unstable_cache } from "next/cache";

/**
 * Service to fetch all published courses (uses cached list).
 */
export async function getAcademyCourses() {
  return getCachedCoursesList();
}

/**
 * Cached service to fetch specific course details including curriculum sections and lessons.
 */
export const getAcademyCourseDetails = cache((id: string) => 
  unstable_cache(
    async () => {
      return await prisma.course.findUnique({
        where: { id },
        include: {
          curriculum: {
            include: {
              lessons: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          },
          reviews: true,
          faqs: true
        }
      });
    },
    [`course-details-${id}`],
    {
      tags: [`course-details-${id}`, "courses-list"]
    }
  )()
);

/**
 * Cached service to fetch similar courses in the same category.
 */
export const getSimilarAcademyCourses = cache((id: string, category: string) =>
  unstable_cache(
    async () => {
      return await prisma.course.findMany({
        where: {
          category,
          id: { not: id },
          published: true,
        },
        take: 2,
        select: {
          id: true,
          title: true,
          coverImage: true,
          shortDescription: true,
          isFree: true,
          price: true,
          discountPrice: true,
          category: true,
          instructor: true,
          difficulty: true,
          tags: true,
          duration: true,
          lessonsCount: true,
          rating: true,
          studentsCount: true,
          language: true,
          updatedAt: true
        }
      });
    },
    [`similar-courses-${id}`],
    {
      tags: [`similar-courses-${id}`, "courses-list"]
    }
  )()
);
