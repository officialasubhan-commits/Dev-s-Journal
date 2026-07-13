import prisma from "@/lib/prisma";
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
    // Find all users (Role: USER or all users). The prompt says "every registered user".
    // We'll get all users.
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length === 0) return 0;

    const data = users.map((user) => ({
      userId: user.id,
      type,
      message,
      title,
      link,
    }));

    const result = await prisma.notification.createMany({
      data,
    });

    return result.count;
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
    let whereClause: UserWhereInput = {};
    if (targetType === "ROLE" && targetRole) {
      whereClause.role = targetRole;
    } else if (targetType === "USER" && targetUserId) {
      // Find by ID or exact email
      whereClause.OR = [
        { id: targetUserId },
        { email: targetUserId }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (users.length === 0) {
      return { notifiedCount: 0, createdCount: 0, failedCount: 0, error: "No users available." };
    }

    const data = users.map((user) => ({
      userId: user.id,
      type,
      message,
      title,
      link: link || undefined,
    }));

    const result = await prisma.notification.createMany({
      data,
    });

    return { 
      notifiedCount: users.length, 
      createdCount: result.count, 
      failedCount: users.length - result.count 
    };
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

    const whereClause: NotificationWhereInput = { userId };
    
    if (filter === "unread") {
      whereClause.read = false;
    } else if (filter === "read") {
      whereClause.read = true;
    } else if (filter && ["JOURNAL", "PROJECT", "LEARNING", "GALLERY", "ANNOUNCEMENT", "INFO", "SUCCESS", "WARNING", "ERROR"].includes(filter.toUpperCase())) {
      whereClause.type = filter.toUpperCase();
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }
    
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
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
