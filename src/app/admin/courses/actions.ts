"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

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
        status: "DRAFT"
      },
    });
    revalidateTag("courses-list", "max");
    revalidateTag("homepage-data", "max");
    revalidatePath("/admin/courses");
    return { success: true, id: course.id };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(id: string, data: any) {
  try {
    // Separate relations and json/metadata from flat course columns if needed
    const { ...updateData } = data;

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    });
    
    revalidateTag("courses-list", "max");
    revalidateTag("homepage-data", "max");
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}/edit`);
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
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
    revalidateTag("courses-list", "max");
    revalidateTag("homepage-data", "max");
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

// Section Management
export async function createSection(courseId: string, title: string, order: number) {
  try {
    const section = await prisma.courseSection.create({
      data: {
        title,
        courseId,
        order
      }
    });
    revalidateTag("courses-list", "max");
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { success: true, section };
  } catch (error) {
    console.error("Error creating section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateSection(sectionId: string, title: string, order?: number) {
  try {
    const section = await prisma.courseSection.update({
      where: { id: sectionId },
      data: {
        title,
        ...(order !== undefined ? { order } : {})
      }
    });
    revalidateTag("courses-list", "max");
    revalidatePath(`/admin/courses/${section.courseId}/edit`);
    return { success: true, section };
  } catch (error) {
    console.error("Error updating section:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string) {
  try {
    const section = await prisma.courseSection.delete({
      where: { id: sectionId }
    });
    revalidateTag("courses-list", "max");
    revalidatePath(`/admin/courses/${section.courseId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting section:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

// Lesson Management
export async function createLesson(sectionId: string, title: string, duration: string, order: number) {
  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        duration,
        order,
        sectionId,
        lessonType: "video"
      }
    });
    
    // Find courseId to revalidate path
    const section = await prisma.courseSection.findUnique({
      where: { id: sectionId },
      select: { courseId: true }
    });
    
    revalidateTag("courses-list", "max");
    if (section) {
      revalidatePath(`/admin/courses/${section.courseId}/edit`);
    }
    
    return { success: true, lesson };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return { success: false, error: "Failed to create lesson" };
  }
}

export async function updateLesson(lessonId: string, data: any) {
  try {
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data
    });
    
    const section = await prisma.courseSection.findUnique({
      where: { id: lesson.sectionId },
      select: { courseId: true }
    });
    
    revalidateTag("courses-list", "max");
    if (section) {
      revalidatePath(`/admin/courses/${section.courseId}/edit`);
    }
    
    return { success: true, lesson };
  } catch (error) {
    console.error("Error updating lesson:", error);
    return { success: false, error: "Failed to update lesson" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.delete({
      where: { id: lessonId }
    });
    
    const section = await prisma.courseSection.findUnique({
      where: { id: lesson.sectionId },
      select: { courseId: true }
    });
    
    revalidateTag("courses-list", "max");
    if (section) {
      revalidatePath(`/admin/courses/${section.courseId}/edit`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, error: "Failed to delete lesson" };
  }
}

// Bulk Curriculum Order Update
export async function reorderCurriculum(
  courseId: string,
  sectionsOrder: { id: string; order: number; lessons: { id: string; order: number }[] }[]
) {
  try {
    // Perform transactional updates
    await prisma.$transaction(
      sectionsOrder.flatMap((sec) => [
        prisma.courseSection.update({
          where: { id: sec.id },
          data: { order: sec.order }
        }),
        ...sec.lessons.map((les) =>
          prisma.lesson.update({
            where: { id: les.id },
            data: { order: les.order, sectionId: sec.id }
          })
        )
      ])
    );
    
    revalidateTag("courses-list", "max");
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering curriculum:", error);
    return { success: false, error: "Failed to save curriculum order" };
  }
}
