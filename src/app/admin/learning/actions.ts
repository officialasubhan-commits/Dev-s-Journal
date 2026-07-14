"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get the admin user ID (used to filter admin content for public pages)
async function getAdminId() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  return admin?.id;
}

export async function createCourse(formData: FormData) {
  const adminId = await getAdminId();
  await prisma.course.create({
    data: {
      title: formData.get("title") as string,
      platform: formData.get("platform") as string,
      progress: parseInt(formData.get("progress") as string) || 0,
      status: formData.get("status") as string || "IN_PROGRESS",
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function updateCourseProgress(id: string, progress: number) {
  const status = progress >= 100 ? "COMPLETED" : "IN_PROGRESS";
  await prisma.course.update({
    where: { id },
    data: { progress, status, completedAt: status === "COMPLETED" ? new Date() : null }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function deleteCourse(id: string) {
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Course Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function createBook(formData: FormData) {
  const adminId = await getAdminId();
  await prisma.book.create({
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      status: formData.get("status") as string || "READING",
      rating: formData.get("rating") ? parseInt(formData.get("rating") as string) : null,
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function deleteBook(id: string) {
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Book Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.book.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function createSkill(formData: FormData) {
  const adminId = await getAdminId();
  await prisma.skill.create({
    data: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      proficiency: parseInt(formData.get("proficiency") as string) || 50,
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}

export async function deleteSkill(id: string) {
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Skill Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
}
