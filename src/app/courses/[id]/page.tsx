import prisma from "@/lib/prisma";
import CourseDetailsClient from "./CourseDetailsClient";
import { notFound } from "next/navigation";
import { Course } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Note: Mock courses used `course-1` as IDs, our seed used db-generated CUIDs.
  // The UI paths use the `id` from the URL. So we query by `id`.
  const dbCourse = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      curriculum: {
        include: {
          lessons: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      },
      reviews: true,
      faqs: true
    }
  });

  if (!dbCourse) {
    notFound();
  }

  const dbSimilarCourses = await prisma.course.findMany({
    where: { 
      category: dbCourse.category,
      id: { not: dbCourse.id }
    },
    take: 2,
    include: {
      curriculum: {
        include: {
          lessons: true
        }
      },
      reviews: true,
      faqs: true
    }
  });

  const mapToUIType = (c: any): Course => {
    let lessonsCount = 0;
    c.curriculum.forEach((section: any) => {
      lessonsCount += section.lessons.length;
    });

    const avgRating = c.reviews.length > 0 
      ? c.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / c.reviews.length 
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
      curriculum: c.curriculum.map((sec: any) => ({
        id: sec.id,
        title: sec.title,
        lessons: sec.lessons.map((les: any) => ({
          id: les.id,
          title: les.title,
          duration: les.duration,
          isPreview: les.isPreview
        }))
      })),
      faqs: c.faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      })),
      reviews: c.reviews.map((rev: any) => ({
        id: rev.id,
        userName: rev.userName,
        rating: rev.rating,
        comment: rev.comment,
        date: rev.createdAt.toISOString(),
        avatarUrl: rev.avatarUrl || undefined
      }))
    };
  };

  const course = mapToUIType(dbCourse);
  const similarCourses = dbSimilarCourses.map(mapToUIType);

  return <CourseDetailsClient course={course} similarCourses={similarCourses} />;
}
