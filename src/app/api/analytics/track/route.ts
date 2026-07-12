import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { path, referrer } = await req.json();
    if (!path) return NextResponse.json({ ok: false });

    const ua = req.headers.get("user-agent") || "";
    const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" :
                   /tablet/i.test(ua) ? "tablet" : "desktop";
    
    // Accept-Language header rough country detection (not IP-based, GDPR safe)
    const acceptLanguage = req.headers.get("accept-language") || "";
    const country = acceptLanguage.split(",")[0]?.split("-")[1]?.toUpperCase() || null;

    await prisma.pageView.create({
      data: { path, referrer: referrer || null, device, country },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
