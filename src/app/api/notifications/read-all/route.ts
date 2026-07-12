import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { markAllAsRead } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    await markAllAsRead(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/notifications/read-all:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
