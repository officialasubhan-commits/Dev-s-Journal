import prisma from "@/lib/prisma";
import CoursesClient from "./CoursesClient";
import { Course } from "@/lib/mockData";

export const dynamic = "force-dynamic"; // or revalidate

export default async function CoursesPage() {
  const dbCourses = await prisma.course.findMany({
    include: {
      curriculum: {
        include: {
          lessons: true
        }
      },
      reviews: true,
      faqs: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const courses: Course[] = dbCourses.map(c => {
    let lessonsCount = 0;
    c.curriculum.forEach(section => {
      lessonsCount += section.lessons.length;
    });

    const avgRating = c.reviews.length > 0 
      ? c.reviews.reduce((acc, curr) => acc + curr.rating, 0) / c.reviews.length 
      : 0;

    return {
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      instructorBio: c.instructorBio || undefined,
      instructorAvatar: c.instructorAvatar || undefined,
      shortDescription: c.shortDescription,
      description: c.description,
      coverImage: c.coverImage || "",
      trailerUrl: c.trailerUrl || undefined,
      difficulty: c.difficulty as any,
      category: c.category,
      tags: c.tags,
      duration: c.duration,
      lessonsCount: lessonsCount,
      rating: Number(avgRating.toFixed(1)),
      studentsCount: c.studentsCount, // Real students count from DB
      language: c.language,
      lastUpdated: c.updatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isFree: c.isFree,
      price: c.price,
      discountPrice: c.discountPrice || undefined,
      outcomes: c.outcomes,
      requirements: c.requirements,
      targetAudience: c.targetAudience,
      certificateInfo: c.certificateInfo || "",
      curriculum: c.curriculum.map(sec => ({
        id: sec.id,
        title: sec.title,
        lessons: sec.lessons.map(les => ({
          id: les.id,
          title: les.title,
          duration: les.duration,
          isPreview: les.isPreview
        }))
      })),
      faqs: c.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer
      })),
      reviews: c.reviews.map(rev => ({
        id: rev.id,
        userName: rev.userName,
        rating: rev.rating,
        comment: rev.comment,
        date: rev.createdAt.toISOString(),
        avatarUrl: rev.avatarUrl || undefined
      }))
    };
  });

  return <CoursesClient courses={courses} />;
}
