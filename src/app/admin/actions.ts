"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { broadcastNotification, sendAdminNotification } from "@/lib/notifications";
import { assertAdmin } from "@/lib/auth";
import { triggerRealtimeUpdate } from "@/lib/pusher";

export async function createPost(formData: FormData) {
  try {
    const session = await assertAdmin();
    const authorId = session.user.id;

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

    console.log("[createPost] Form fields parsed:", { title, slug, isContentEmpty: !content, published });

    if (!title || !slug || !content) {
      const missing = [];
      if (!title) missing.push("Title");
      if (!slug) missing.push("Slug");
      if (!content) missing.push("Content");
      return { error: `Missing required fields: ${missing.join(", ")}` };
    }

    // Check unique slug
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      console.warn(`[createPost] Duplicate slug violation: ${slug}`);
      return { error: "DUPLICATE_ENTRY", id: existing.id };
    }

    const newPost = await prisma.post.create({
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

    console.log("[createPost] Post created successfully:", newPost.id);

    if (published) {
      await broadcastNotification(
        "JOURNAL",
        `New journal entry published: ${title}`,
        "📢 New Journal Published",
        `/journal/${slug}`
      );
      await triggerRealtimeUpdate("devs-journal-sync", "notifications-updated");
    }

    revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

    revalidatePath("/journal");
    revalidatePath("/journal/[slug]");
    revalidatePath("/");
    revalidatePath("/admin/posts");
  } catch (error: any) {
    console.error("[createPost] Error saving to database:", error);
    return { error: `Database save failed: ${error?.message || error}` };
  }

  // Next.js redirect must be run outside try/catch to redirect client cleanly
  redirect("/admin/posts");
}

export async function createProject(formData: FormData) {
  const session = await assertAdmin();
  const authorId = session.user.id;

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

  if (!title || !slug || !description) return { error: "Missing required fields" };

  // Check unique slug
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    console.warn(`[createProject] Duplicate slug violation: ${slug}`);
    return { error: "DUPLICATE_ENTRY", id: existing.id };
  }

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
    await triggerRealtimeUpdate("devs-journal-sync", "notifications-updated");
  }

  revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

  revalidatePath("/projects");
  revalidatePath("/projects/[slug]");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updatePost(id: string, formData: FormData) {
  try {
    await assertAdmin();
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

    console.log("[updatePost] Form fields parsed for update:", { id, title, slug, isContentEmpty: !content, published });

    if (!title || !slug || !content) {
      const missing = [];
      if (!title) missing.push("Title");
      if (!slug) missing.push("Slug");
      if (!content) missing.push("Content");
      return { error: `Missing required fields: ${missing.join(", ")}` };
    }

    // Check unique slug on other posts
    const existing = await prisma.post.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });
    if (existing) {
      console.warn(`[updatePost] Duplicate slug violation: ${slug}`);
      return { error: `A post with the slug "${slug}" already exists. Please choose a different slug.` };
    }

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

    console.log("[updatePost] Post updated successfully:", id);

    revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

    revalidatePath("/journal");
    revalidatePath("/journal/[slug]");
    revalidatePath(`/journal/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/posts");
  } catch (error: any) {
    console.error("[updatePost] Error updating database:", error);
    return { error: `Database update failed: ${error?.message || error}` };
  }

  redirect("/admin/posts");
}

export async function updateProject(id: string, formData: FormData) {
  await assertAdmin();
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

  revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

  revalidatePath("/projects");
  revalidatePath("/projects/[slug]");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deletePost(id: string) {
  try {
    await assertAdmin();
    const { autoBackup } = await import("./backups/actions");
    await autoBackup("Post Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  const post = await prisma.post.delete({
    where: { id },
    select: { slug: true }
  });
  if (post?.slug) {
    await prisma.notification.updateMany({
      where: { link: `/journal/${post.slug}` },
      data: { archived: true }
    });
    revalidatePath(`/journal/${post.slug}`);
  }
  revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
  revalidatePath("/journal");
  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function deleteProject(id: string) {
  try {
    await assertAdmin();
    const { autoBackup } = await import("./backups/actions");
    await autoBackup("Project Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  const project = await prisma.project.delete({
    where: { id },
    select: { slug: true }
  });
  if (project?.slug) {
    await prisma.notification.updateMany({
      where: { link: `/projects/${project.slug}` },
      data: { archived: true }
    });
    revalidatePath(`/projects/${project.slug}`);
  }
  revalidateTag("homepage-data", "max");
    revalidateTag("about-page-data", "max");
    revalidateTag("posts-list", "max");
    revalidateTag("projects-list", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function broadcastAnnouncement(formData: FormData) {
  await assertAdmin();
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

  await triggerRealtimeUpdate("devs-journal-sync", "notifications-updated");

  return { 
    success: true, 
    notifiedCount: result.notifiedCount, 
    createdCount: result.createdCount,
    failedCount: result.failedCount
  };
}

export async function createLearningUpdate(title: string, message: string, url: string) {
  await assertAdmin();
  if (!title || !message) return { success: false, error: "Title and message are required" };

  // E.g., when a new course or certificate is added, trigger this notification
  await broadcastNotification("LEARNING", message, title, url || undefined);
  await triggerRealtimeUpdate("devs-journal-sync", "notifications-updated");
  return { success: true };
}
