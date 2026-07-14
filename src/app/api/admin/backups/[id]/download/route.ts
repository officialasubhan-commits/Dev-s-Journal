import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const backup = await prisma.backup.findUnique({
      where: { id },
    });

    if (!backup) {
      return new NextResponse("Backup not found", { status: 404 });
    }

    const filename = `backup-${backup.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date(backup.createdAt).toISOString().split('T')[0]}.json`;

    return new NextResponse(backup.payload, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Backup download error:", error);
    return new NextResponse(error?.message || "Internal Server Error", { status: 500 });
  }
}
