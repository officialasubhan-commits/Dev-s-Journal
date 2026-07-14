"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateLink } from "@/lib/linkValidator";

async function getAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("Admin not found");
  return admin;
}

export async function getNotificationsList(params: {
  search?: string;
  status?: "all" | "published" | "draft";
  pinned?: "all" | "pinned" | "unpinned";
  archived?: "all" | "archived" | "active";
  priority?: "all" | "LOW" | "MEDIUM" | "HIGH";
  page?: number;
  limit?: number;
}) {
  try {
    const admin = await getAdmin();
    const { search, status, pinned, archived, priority, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId: admin.id
    };

    if (status === "published") whereClause.published = true;
    if (status === "draft") whereClause.published = false;

    if (pinned === "pinned") whereClause.pinned = true;
    if (pinned === "unpinned") whereClause.pinned = false;

    if (archived === "archived") whereClause.archived = true;
    if (archived === "active") whereClause.archived = false;

    if (priority && priority !== "all") whereClause.priority = priority;

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [notifications, totalCount, stats] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: [
          { pinned: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause }),
      Promise.all([
        prisma.notification.count({ where: { userId: admin.id } }),
        prisma.notification.count({ where: { userId: admin.id, published: true } }),
        prisma.notification.count({ where: { userId: admin.id, published: false } }),
        prisma.notification.count({ where: { userId: admin.id, pinned: true } }),
        prisma.notification.count({ where: { userId: admin.id, archived: true } }),
      ])
    ]);

    const processedNotifications = await Promise.all(
      notifications.map(async (n) => {
        const isValidLink = n.link ? await validateLink(n.link) : true;
        return {
          ...n,
          isValidLink,
          createdAt: n.createdAt.toISOString(),
          updatedAt: n.updatedAt.toISOString(),
          publishedAt: n.publishedAt ? n.publishedAt.toISOString() : null,
        };
      })
    );

    return {
      notifications: processedNotifications,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      stats: {
        total: stats[0],
        published: stats[1],
        draft: stats[2],
        pinned: stats[3],
        archived: stats[4],
      }
    };
  } catch (error) {
    console.error("Failed to fetch notification list:", error);
    throw error;
  }
}

export async function createNotificationAction(data: {
  title: string;
  message: string;
  type: string;
  priority: string;
  published: boolean;
  pinned: boolean;
  link?: string;
}) {
  const admin = await getAdmin();

  if (data.link && data.link.trim() !== "") {
    const trimmedLink = data.link.trim();
    if (trimmedLink.startsWith("/admin")) {
      throw new Error("Cannot publish notifications pointing to admin-only URLs (/admin/...).");
    }
    const isValid = await validateLink(trimmedLink);
    if (!isValid) {
      throw new Error("Invalid URL link. The referenced page or resource does not exist.");
    }
  }
  
  const notification = await prisma.notification.create({
    data: {
      userId: admin.id,
      title: data.title,
      message: data.message,
      type: data.type || "INFO",
      priority: data.priority || "MEDIUM",
      published: data.published,
      pinned: data.pinned,
      link: data.link || null,
      publishedAt: data.published ? new Date() : null,
    }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, id: notification.id };
}

export async function updateNotificationAction(id: string, data: {
  title: string;
  message: string;
  type: string;
  priority: string;
  published: boolean;
  pinned: boolean;
  link?: string;
}) {
  const admin = await getAdmin();

  if (data.link && data.link.trim() !== "") {
    const trimmedLink = data.link.trim();
    if (trimmedLink.startsWith("/admin")) {
      throw new Error("Cannot publish notifications pointing to admin-only URLs (/admin/...).");
    }
    const isValid = await validateLink(trimmedLink);
    if (!isValid) {
      throw new Error("Invalid URL link. The referenced page or resource does not exist.");
    }
  }
  
  const existing = await prisma.notification.findFirst({
    where: { id, userId: admin.id }
  });
  if (!existing) throw new Error("Notification not found");

  const notification = await prisma.notification.update({
    where: { id },
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority,
      published: data.published,
      pinned: data.pinned,
      link: data.link || null,
      publishedAt: data.published && !existing.published ? new Date() : existing.publishedAt,
    }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, id: notification.id };
}

export async function deleteNotificationAction(id: string) {
  const admin = await getAdmin();
  await prisma.notification.delete({
    where: { id }
  });
  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true };
}

export async function togglePublishAction(id: string) {
  const admin = await getAdmin();
  const existing = await prisma.notification.findFirst({ where: { id, userId: admin.id } });
  if (!existing) throw new Error("Notification not found");

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      published: !existing.published,
      publishedAt: !existing.published ? new Date() : null
    }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, published: updated.published };
}

export async function togglePinAction(id: string) {
  const admin = await getAdmin();
  const existing = await prisma.notification.findFirst({ where: { id, userId: admin.id } });
  if (!existing) throw new Error("Notification not found");

  const updated = await prisma.notification.update({
    where: { id },
    data: { pinned: !existing.pinned }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, pinned: updated.pinned };
}

export async function toggleArchiveAction(id: string) {
  const admin = await getAdmin();
  const existing = await prisma.notification.findFirst({ where: { id, userId: admin.id } });
  if (!existing) throw new Error("Notification not found");

  const updated = await prisma.notification.update({
    where: { id },
    data: { archived: !existing.archived }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, archived: updated.archived };
}

export async function duplicateNotificationAction(id: string) {
  const admin = await getAdmin();
  const existing = await prisma.notification.findFirst({ where: { id, userId: admin.id } });
  if (!existing) throw new Error("Notification not found");

  const duplicated = await prisma.notification.create({
    data: {
      userId: admin.id,
      title: existing.title ? `${existing.title} (Copy)` : "Copy Announcement",
      message: existing.message,
      type: existing.type,
      priority: existing.priority,
      published: false,
      pinned: false,
      link: existing.link,
      publishedAt: null,
    }
  });

  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true, id: duplicated.id };
}

export async function bulkDeleteAction(ids: string[]) {
  const admin = await getAdmin();
  await prisma.notification.deleteMany({
    where: { id: { in: ids }, userId: admin.id }
  });
  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true };
}

export async function bulkPublishAction(ids: string[], publish: boolean) {
  const admin = await getAdmin();
  await prisma.notification.updateMany({
    where: { id: { in: ids }, userId: admin.id },
    data: {
      published: publish,
      publishedAt: publish ? new Date() : null
    }
  });
  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  return { success: true };
}
