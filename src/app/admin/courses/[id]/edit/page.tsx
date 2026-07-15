import prisma from "@/lib/prisma";
import CourseEditForm from "./CourseEditForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      curriculum: {
        include: {
          lessons: {
            orderBy: { order: "asc" }
          }
        },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Parse JSON/Json fields safely
  const serializedCourse = {
    ...course,
    instructorSocials: course.instructorSocials || { linkedin: "", twitter: "", github: "" },
    quizzes: course.quizzes || [],
    resources: course.resources || [],
    lastUpdated: course.lastUpdated.toISOString(),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    curriculum: course.curriculum.map(sec => ({
      ...sec,
      createdAt: sec.createdAt.toISOString(),
      lessons: sec.lessons.map(les => ({
        ...les,
        attachments: les.attachments || [],
        createdAt: les.createdAt.toISOString()
      }))
    }))
  };

  return <CourseEditForm initialData={serializedCourse} />;
}
