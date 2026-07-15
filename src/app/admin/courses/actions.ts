"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourse(data: {
  title: string;
  slug: string;
  instructor: string;
  shortDescription: string;
  description: string;
  coverImage?: string;
  difficulty: string;
  category: string;
  tags: string[];
  duration: string;
  isFree: boolean;
  price: number;
}) {
  try {
    const course = await prisma.course.create({
      data: {
        ...data,
        coverImage: data.coverImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop",
      },
    });
    revalidatePath("/admin/courses");
    return { success: true, id: course.id };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(id: string, data: Partial<{
  title: string;
  slug: string;
  instructor: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  difficulty: string;
  category: string;
  tags: string[];
  duration: string;
  isFree: boolean;
  price: number;
}>) {
  try {
    const course = await prisma.course.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}/edit`);
    return { success: true, id: course.id };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({
      where: { id },
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}
