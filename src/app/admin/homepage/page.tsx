import prisma from "@/lib/prisma";
import { getSiteSettings } from "../settings/actions";
import { HomepageSettingsForm } from "./HomepageSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [
    settings,
    projects,
    posts,
    certifications,
    courses
  ] = await Promise.all([
    getSiteSettings(),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.certification.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.userLearning.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Homepage Layout Customizer</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure layout titles, button destinations, hero avatars, and select featured items display lists.</p>
      </div>

      <HomepageSettingsForm 
        settings={settings}
        projects={projects}
        posts={posts}
        certifications={certifications}
        courses={courses}
      />
    </div>
  );
}
