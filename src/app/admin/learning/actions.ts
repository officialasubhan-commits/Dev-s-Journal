"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { triggerRealtimeUpdate } from "@/lib/pusher";

// Get the admin user ID (used to filter admin content for public pages)
async function getAdminId() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  return admin?.id;
}

export async function createCourse(formData: FormData) {
  await assertAdmin();
  const adminId = await getAdminId();
  const title = formData.get("title") as string;
  const platform = formData.get("platform") as string;

  if (!title || !platform) {
    return { error: "Title and platform are required" };
  }

  const existing = await prisma.course.findFirst({
    where: { title, platform, userId: adminId }
  });

  if (existing) {
    return { error: "DUPLICATE_ENTRY", id: existing.id };
  }

  await prisma.course.create({
    data: {
      title,
      platform,
      progress: parseInt(formData.get("progress") as string) || 0,
      status: formData.get("status") as string || "IN_PROGRESS",
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
  return { success: true };
}

export async function updateCourseProgress(id: string, progress: number) {
  await assertAdmin();
  const status = progress >= 100 ? "COMPLETED" : "IN_PROGRESS";
  await prisma.course.update({
    where: { id },
    data: { progress, status, completedAt: status === "COMPLETED" ? new Date() : null }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function deleteCourse(id: string) {
  await assertAdmin();
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Course Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function createBook(formData: FormData) {
  await assertAdmin();
  const adminId = await getAdminId();
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;

  if (!title || !author) {
    return { error: "Title and author are required" };
  }

  const existing = await prisma.book.findFirst({
    where: { title, author, userId: adminId }
  });

  if (existing) {
    return { error: "DUPLICATE_ENTRY", id: existing.id };
  }

  await prisma.book.create({
    data: {
      title,
      author,
      status: formData.get("status") as string || "READING",
      rating: formData.get("rating") ? parseInt(formData.get("rating") as string) : null,
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
  return { success: true };
}

export async function deleteBook(id: string) {
  await assertAdmin();
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Book Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.book.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function createSkill(formData: FormData) {
  await assertAdmin();
  const adminId = await getAdminId();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;

  if (!name || !category) {
    return { error: "Name and category are required" };
  }

  const existing = await prisma.skill.findFirst({
    where: { name, userId: adminId }
  });

  if (existing) {
    return { error: "DUPLICATE_ENTRY", id: existing.id };
  }

  await prisma.skill.create({
    data: {
      name,
      category,
      proficiency: parseInt(formData.get("proficiency") as string) || 50,
      userId: adminId,
    }
  });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
  return { success: true };
}

export async function deleteSkill(id: string) {
  await assertAdmin();
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Skill Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/learning");
  revalidatePath("/learning");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function createCourseForm(formData: FormData): Promise<void> {
  await createCourse(formData);
}

export async function createBookForm(formData: FormData): Promise<void> {
  await createBook(formData);
}

export async function createSkillForm(formData: FormData): Promise<void> {
  await createSkill(formData);
}
