import prisma from "@/lib/prisma";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const dbCourses = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      curriculum: {
        include: {
          lessons: true
        }
      }
    }
  });

  const courses = dbCourses.map(c => {
    let lessonsCount = 0;
    c.curriculum.forEach(section => {
      lessonsCount += section.lessons.length;
    });

    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      difficulty: c.difficulty,
      lessonsCount,
      studentsCount: c.studentsCount,
      isFree: c.isFree,
      price: c.price,
      discountPrice: c.discountPrice,
      coverImage: c.coverImage
    };
  });

  return <CoursesClient initialCourses={courses} />;
}
