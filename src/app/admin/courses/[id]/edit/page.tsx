import prisma from "@/lib/prisma";
import CourseEditForm from "./CourseEditForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id }
  });

  if (!course) {
    notFound();
  }

  return <CourseEditForm initialData={course} />;
}
