import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { markAsRead, deleteNotification } from "@/lib/notifications";

export async function PATCH(req: Request, context: { params: Promise<unknown> }) {
  try {
    const resolvedParams = (await context.params) as { id: string };
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    await markAsRead(resolvedParams.id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PATCH /api/notifications/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<unknown> }) {
  try {
    const resolvedParams = (await context.params) as { id: string };
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    await deleteNotification(resolvedParams.id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/notifications/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
