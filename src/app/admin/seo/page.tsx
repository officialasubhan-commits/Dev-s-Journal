import { getSiteSettings } from "../settings/actions";
import { SeoSettingsForm } from "../settings/SeoSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">SEO Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure search optimization, keyword indices, and social OpenGraph image previews.</p>
      </div>

      <SeoSettingsForm settings={settings as any} />
    </div>
  );
}
