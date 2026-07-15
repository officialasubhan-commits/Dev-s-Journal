import { NextResponse } from "next/server";
import { getSiteSettings } from "@/app/admin/settings/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();

    return NextResponse.json({
      enabled: settings?.maintenanceEnabled ?? false,
      maintenanceMessage: settings?.maintenanceMessage ?? "We'll be back soon!",
    });
  } catch (error) {
    console.error("Failed to fetch maintenance status:", error);
    return NextResponse.json({ enabled: false, error: "Database error" }, { status: 500 });
  }
}
