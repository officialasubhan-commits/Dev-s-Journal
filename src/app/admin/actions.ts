"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { broadcastNotification, sendAdminNotification } from "@/lib/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  const authorId = session?.user?.id;

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  
  const coverImage = formData.get("coverImage") as string | null;
  const mood = formData.get("mood") as string | null;
  const readingTime = parseInt((formData.get("readingTime") as string) || "5");
  const pinned = formData.get("pinned") === "on";
  const archived = formData.get("archived") === "on";
  const seoTitle = formData.get("seoTitle") as string | null;
  const seoDescription = formData.get("seoDescription") as string | null;
  
  // Extract tags as a comma separated string and split
  const tagsString = formData.get("tags") as string | null;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
  
  const scheduledForStr = formData.get("scheduledFor") as string | null;
  const scheduledFor = scheduledForStr ? new Date(scheduledForStr) : null;



  if (!title || !slug || !content) return;

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      published,
      coverImage,
      mood,
      readingTime,
      pinned,
      archived,
      seoTitle,
      seoDescription,
      tags,
      scheduledFor,
      authorId
    },
  });

  if (published) {
    await broadcastNotification(
      "JOURNAL",
      `New journal entry published: ${title}`,
      "📢 New Journal Published",
      `/journal/${slug}`
    );
  }

  revalidatePath("/journal");
  revalidatePath("/journal/[slug]");
  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  const authorId = session?.user?.id;

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  const coverImage = formData.get("coverImage") as string | null;
  const demoVideo = formData.get("demoVideo") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const liveUrl = formData.get("liveUrl") as string | null;
  const features = formData.get("features") as string | null;
  const challenges = formData.get("challenges") as string | null;
  const lessonsLearned = formData.get("lessonsLearned") as string | null;
  const pinned = formData.get("pinned") === "on";

  // Parse arrays
  const technologiesStr = formData.get("technologies") as string | null;
  const technologies = technologiesStr ? technologiesStr.split(",").map(t => t.trim()).filter(Boolean) : [];
  
  const imagesStr = formData.get("images") as string | null;
  const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];

  const startDateStr = formData.get("startDate") as string | null;
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDateStr = formData.get("endDate") as string | null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  if (!title || !slug || !description) return;

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      published,
      coverImage,
      demoVideo,
      githubUrl,
      liveUrl,
      features,
      challenges,
      lessonsLearned,
      pinned,
      technologies,
      images,
      startDate,
      endDate,
      authorId
    },
  });

  if (published) {
    await broadcastNotification(
      "PROJECT",
      `New project released: ${title}`,
      "🚀 New Project Released",
      `/projects/${slug}`
    );
  }

  revalidatePath("/projects");
  revalidatePath("/projects/[slug]");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  const coverImage = formData.get("coverImage") as string | null;
  const mood = formData.get("mood") as string | null;
  const readingTime = parseInt((formData.get("readingTime") as string) || "5");
  const pinned = formData.get("pinned") === "on";
  const archived = formData.get("archived") === "on";
  const seoTitle = formData.get("seoTitle") as string | null;
  const seoDescription = formData.get("seoDescription") as string | null;
  
  // Extract tags as a comma separated string and split
  const tagsString = formData.get("tags") as string | null;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
  
  const scheduledForStr = formData.get("scheduledFor") as string | null;
  const scheduledFor = scheduledForStr ? new Date(scheduledForStr) : null;



  if (!title || !slug || !content) return;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      published,
      coverImage,
      mood,
      readingTime,
      pinned,
      archived,
      seoTitle,
      seoDescription,
      tags,
      scheduledFor
    },
  });

  revalidatePath("/journal");
  revalidatePath("/journal/[slug]");
  revalidatePath(`/journal/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  const coverImage = formData.get("coverImage") as string | null;
  const demoVideo = formData.get("demoVideo") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const liveUrl = formData.get("liveUrl") as string | null;
  const features = formData.get("features") as string | null;
  const challenges = formData.get("challenges") as string | null;
  const lessonsLearned = formData.get("lessonsLearned") as string | null;
  const pinned = formData.get("pinned") === "on";

  // Parse arrays
  const technologiesStr = formData.get("technologies") as string | null;
  const technologies = technologiesStr ? technologiesStr.split(",").map(t => t.trim()).filter(Boolean) : [];
  
  const imagesStr = formData.get("images") as string | null;
  const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];

  const startDateStr = formData.get("startDate") as string | null;
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDateStr = formData.get("endDate") as string | null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  if (!title || !slug || !description) return;

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      published,
      coverImage,
      demoVideo,
      githubUrl,
      liveUrl,
      features,
      challenges,
      lessonsLearned,
      pinned,
      technologies,
      images,
      startDate,
      endDate
    },
  });

  revalidatePath("/projects");
  revalidatePath("/projects/[slug]");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deletePost(id: string) {
  const post = await prisma.post.delete({
    where: { id },
    select: { slug: true }
  });
  revalidatePath("/journal");
  if (post?.slug) revalidatePath(`/journal/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function deleteProject(id: string) {
  const project = await prisma.project.delete({
    where: { id },
    select: { slug: true }
  });
  revalidatePath("/projects");
  if (project?.slug) revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function broadcastAnnouncement(formData: FormData) {
  const targetType = (formData.get("targetType") as "ALL" | "ROLE" | "USER") || "ALL";
  const targetRole = formData.get("targetRole") as string | undefined;
  const targetUserId = formData.get("targetUserId") as string | undefined;
  const type = (formData.get("type") as string) || "INFO";
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const link = formData.get("link") as string | null;

  if (!title || !message) return { success: false, error: "Title and message are required" };
  if (targetType === "ROLE" && !targetRole) return { success: false, error: "Role is required when targeting by role" };
  if (targetType === "USER" && !targetUserId) return { success: false, error: "User ID or Email is required when targeting a specific user" };

  const result = await sendAdminNotification(
    targetType,
    type,
    message,
    title,
    link || undefined,
    targetRole,
    targetUserId
  );

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { 
    success: true, 
    notifiedCount: result.notifiedCount, 
    createdCount: result.createdCount,
    failedCount: result.failedCount
  };
}

export async function createLearningUpdate(title: string, message: string, url: string) {
  if (!title || !message) return { success: false, error: "Title and message are required" };

  // E.g., when a new course or certificate is added, trigger this notification
  await broadcastNotification("LEARNING", message, title, url || undefined);
  return { success: true };
}
