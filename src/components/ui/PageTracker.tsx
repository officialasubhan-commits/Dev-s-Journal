"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages or API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const referrer = document.referrer || null;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {}); // Fire and forget — never block the user
  }, [pathname]);

  return null;
}
