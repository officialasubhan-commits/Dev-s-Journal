import prisma from "@/lib/prisma";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const dbCourses = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      difficulty: true,
      lessonsCount: true,
      studentsCount: true,
      isFree: true,
      price: true,
      discountPrice: true,
      coverImage: true
    }
  });

  const courses = dbCourses.map(c => {
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      difficulty: c.difficulty,
      lessonsCount: c.lessonsCount,
      studentsCount: c.studentsCount,
      isFree: c.isFree,
      price: c.price,
      discountPrice: c.discountPrice,
      coverImage: c.coverImage
    };
  });

  return <CoursesClient initialCourses={courses} />;
}
