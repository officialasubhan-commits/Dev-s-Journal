import { getSiteSettings } from "../settings/actions";
import { BrandingSettingsForm } from "../settings/BrandingSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminBrandingPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Branding Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure identity, logos, titles, taglines, and theme characteristics.</p>
      </div>

      <BrandingSettingsForm settings={settings as any} />
    </div>
  );
}
