import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type UserWhereInput = NonNullable<Parameters<typeof prisma.user.findMany>[0]>["where"];
type NotificationWhereInput = NonNullable<Parameters<typeof prisma.notification.findMany>[0]>["where"];
export type NotificationType = "JOURNAL" | "PROJECT" | "LEARNING" | "GALLERY" | "ANNOUNCEMENT" | "INFO" | "SUCCESS" | "WARNING" | "ERROR";

/**
 * Broadcasts a notification to all registered users (Role: USER).
 * Used exclusively by Administrators.
 */
export async function broadcastNotification(
  type: NotificationType,
  message: string,
  title?: string,
  link?: string
) {
  try {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) throw new Error("Admin user not found");

    await prisma.notification.create({
      data: {
        userId: admin.id,
        type,
        message,
        title,
        link: link || null,
        published: true,
        publishedAt: new Date(),
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/admin/notifications");
    
    return 1;
  } catch (error) {
    console.error("Failed to broadcast notification:", error);
    return 0;
  }
}

export async function sendAdminNotification(
  targetType: "ALL" | "ROLE" | "USER",
  type: string,
  message: string,
  title?: string,
  link?: string,
  targetRole?: string,
  targetUserId?: string
) {
  try {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) throw new Error("Admin not found");

    if (targetType === "USER" && targetUserId) {
      const targetUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: targetUserId },
            { email: targetUserId },
            { username: targetUserId }
          ]
        },
        select: { id: true }
      });

      if (!targetUser) {
        return { notifiedCount: 0, createdCount: 0, failedCount: 0, error: "Recipient user not found." };
      }

      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          type,
          message,
          title,
          link: link || null,
          published: true,
          publishedAt: new Date(),
        }
      });

      revalidatePath("/notifications");
      revalidatePath("/admin/notifications");

      return { notifiedCount: 1, createdCount: 1, failedCount: 0 };
    }

    await prisma.notification.create({
      data: {
        userId: admin.id,
        type,
        message,
        title,
        link: link || null,
        published: true,
        publishedAt: new Date(),
      }
    });

    revalidatePath("/notifications");
    revalidatePath("/admin/notifications");

    return { notifiedCount: 1, createdCount: 1, failedCount: 0 };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { notifiedCount: 0, createdCount: 0, failedCount: 0, error: "Database error" };
  }
}

export async function getUserNotifications(
  userId: string,
  options?: { filter?: string; search?: string; page?: number; limit?: number }
) {
  try {
    const { filter, search, page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const adminId = admin?.id || "";

    const whereClause: NotificationWhereInput = {
      OR: [
        { userId },
        ...(adminId && adminId !== userId
          ? [{ userId: adminId, published: true, archived: false }]
          : []
        )
      ]
    };
    
    if (filter === "unread") {
      whereClause.read = false;
    } else if (filter === "read") {
      whereClause.read = true;
    } else if (filter && ["JOURNAL", "PROJECT", "LEARNING", "GALLERY", "ANNOUNCEMENT", "INFO", "SUCCESS", "WARNING", "ERROR"].includes(filter.toUpperCase())) {
      whereClause.type = filter.toUpperCase();
    }

    if (search) {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
          ]
        }
      ];
    }
    
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: [
          { pinned: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause })
    ]);

    return {
      notifications,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { notifications: [], totalCount: 0, totalPages: 0 };
  }
}

export async function getUnreadCount(userId: string) {
  try {
    return await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return 0;
  }
}

export async function markAsRead(notificationId: string, userId: string) {
  try {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return null;
  }
}

export async function markAllAsRead(userId: string) {
  try {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return null;
  }
}

export async function deleteNotification(notificationId: string, userId: string) {
  try {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return null;
  }
}
