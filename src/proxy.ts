import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Core /admin route protection (original logic preserved)
    if (path.startsWith("/admin")) {
      // Allow access to the login page itself
      if (path === "/admin/login") {
        if (token && token.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        return NextResponse.next();
      }

      // If no token or not admin role, redirect to /admin/login
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return NextResponse.next();
    }

    // 2. Exempt routes that should NEVER be checked or blocked by maintenance mode
    const isExempt =
      path === "/maintenance" ||
      path === "/api/maintenance/status" ||
      path.startsWith("/api/auth") ||
      path.startsWith("/api/admin") ||
      path.startsWith("/_next") ||
      path === "/favicon.ico" ||
      path === "/robots.txt" ||
      path === "/sitemap.xml";

    if (isExempt) {
      return NextResponse.next();
    }

    // 3. Admin bypass: If user is authenticated as ADMIN, they bypass maintenance mode on all pages
    const isAdmin = token && token.role === "ADMIN";
    if (isAdmin) {
      return NextResponse.next();
    }

    // 4. Maintenance mode check for non-exempt visitor routes
    try {
      const origin = req.nextUrl.origin;
      const statusRes = await fetch(`${origin}/api/maintenance/status`, {
        cache: "no-store",
      });

      if (statusRes.ok) {
        const data = await statusRes.json();
        
        if (data.enabled) {
          // Block API routes with a 503 JSON response
          if (path.startsWith("/api")) {
            return new NextResponse(
              JSON.stringify({ error: "Site is currently undergoing scheduled maintenance" }),
              { status: 503, headers: { "content-type": "application/json" } }
            );
          }
          // Redirect page visits to the maintenance page
          return NextResponse.redirect(new URL("/maintenance", req.url));
        }
      }
    } catch (error) {
      // In case of database connection or fetch error, fallback to normal operation so the site doesn't crash.
      console.error("[Middleware] Maintenance mode check failed, allowing request:", error);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Authorization is fully handled inside the middleware function above
    },
  }
);

export const config = {
  /*
   * Match all paths except:
   * - static files under /images or /static
   * - files containing extensions (e.g., .css, .js, .png, etc.)
   */
  matcher: [
    "/((?!_next/static|_next/image|images|static|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
