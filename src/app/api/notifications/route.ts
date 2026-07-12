import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserNotifications, getUnreadCount } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const isPublicReq = searchParams.get("public") === "true";

    if (isPublicReq) {
      // Public notifications (e.g. type ANNOUNCEMENT or INFO, we'll assume ANNOUNCEMENT is public)
      // Since we don't have an isPublic boolean yet, we'll use type === 'ANNOUNCEMENT' as a proxy for public, 
      // or we can just return all notifications with type 'ANNOUNCEMENT'
      const notifications = await prisma.notification.findMany({
        where: { type: "ANNOUNCEMENT" },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return NextResponse.json({ notifications, unreadCount: 0, totalCount: notifications.length, totalPages: 1, page: 1 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const { notifications, totalCount, totalPages } = await getUserNotifications(userId, {
      filter,
      search,
      page,
      limit
    });
    
    const unreadCount = await getUnreadCount(userId);

    return NextResponse.json({ notifications, unreadCount, totalCount, totalPages, page });
  } catch (error) {
    console.error("Error in GET /api/notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
