import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserNotifications, getUnreadCount } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const isPublicReq = searchParams.get("public") === "true";

    if (isPublicReq) {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
      if (!admin) {
        return NextResponse.json({ notifications: [], unreadCount: 0, totalCount: 0, totalPages: 1, page: 1 });
      }

      const publicTypes = ["JOURNAL", "PROJECT", "LEARNING", "GALLERY", "ANNOUNCEMENT"];
      const whereClause: any = {
        userId: admin.id,
        published: true,
        archived: false,
        type: { in: publicTypes }
      };

      if (filter && filter !== "all") {
        if (publicTypes.includes(filter.toUpperCase())) {
          whereClause.type = filter.toUpperCase();
        }
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

      const skip = (page - 1) * limit;

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

      return NextResponse.json({
        notifications,
        unreadCount: 0,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page
      });
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
