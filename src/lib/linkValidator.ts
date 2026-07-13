import prisma from "@/lib/prisma";

export async function validateLink(link: string | null | undefined): Promise<boolean> {
  if (!link || link.trim() === "") return true; // Empty link is valid

  // Normalize spaces
  const trimmed = link.trim();

  // If it's an absolute URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // Must be a relative URL starting with /
  if (!trimmed.startsWith("/")) return false;

  // Split path and query parameters / hashes
  const urlPath = trimmed.split("?")[0].split("#")[0];
  const parts = urlPath.split("/").filter(Boolean);

  if (parts.length === 0) return true; // "/" is valid

  const firstSegment = parts[0];

  // Check static client-facing routes
  const staticRoutes = ["about", "gallery", "learning", "contact", "notifications", "setup", "unauthorized"];
  if (staticRoutes.includes(firstSegment) && parts.length === 1) {
    return true;
  }

  // Journal detail path: /journal/[slug]
  if (firstSegment === "journal") {
    if (parts.length === 1) return true; // "/journal" is valid list page
    if (parts.length === 2) {
      const slug = parts[1];
      const post = await prisma.post.findUnique({
        where: { slug }
      });
      return !!post;
    }
    return false;
  }

  // Project detail path: /projects/[slug]
  if (firstSegment === "projects") {
    if (parts.length === 1) return true; // "/projects" is valid list page
    if (parts.length === 2) {
      const slug = parts[1];
      const project = await prisma.project.findUnique({
        where: { slug }
      });
      return !!project;
    }
    return false;
  }

  // Admin routes
  if (firstSegment === "admin") {
    if (parts.length === 1) return true; // "/admin" dashboard redirect
    const secondSegment = parts[1];
    
    const adminStaticRoutes = ["about", "analytics", "comments", "contact", "dashboard", "gallery", "learning", "login", "messages", "notifications", "posts", "projects", "settings", "users"];
    if (adminStaticRoutes.includes(secondSegment) && parts.length === 2) {
      return true;
    }

    if (secondSegment === "posts" && parts.length === 3) {
      if (parts[2] === "new") return true;
      // edit route: /admin/posts/[id]
      const post = await prisma.post.findUnique({ where: { id: parts[2] } });
      return !!post;
    }

    if (secondSegment === "projects" && parts.length === 3) {
      if (parts[2] === "new") return true;
      // edit route: /admin/projects/[id]
      const project = await prisma.project.findUnique({ where: { id: parts[2] } });
      return !!project;
    }

    if (secondSegment === "users" && parts.length === 3) {
      const user = await prisma.user.findUnique({ where: { id: parts[2] } });
      return !!user;
    }
    
    return false;
  }

  return false;
}
