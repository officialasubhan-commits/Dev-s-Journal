import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
      select: {
        maintenanceEnabled: true,
        maintenanceMessage: true,
      },
    });

    return NextResponse.json({
      enabled: settings?.maintenanceEnabled ?? false,
      maintenanceMessage: settings?.maintenanceMessage ?? "We'll be back soon!",
    });
  } catch (error) {
    console.error("Failed to fetch maintenance status:", error);
    return NextResponse.json({ enabled: false, error: "Database error" }, { status: 500 });
  }
}
