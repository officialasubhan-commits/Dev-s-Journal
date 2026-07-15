import { getSiteSettings } from "../settings/actions";
import { FooterSettingsForm } from "./FooterSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminFooterPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Footer Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure footer copy, copyright tags, and secondary logo indicators.</p>
      </div>

      <FooterSettingsForm settings={settings as any} />
    </div>
  );
}
